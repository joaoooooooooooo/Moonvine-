import { useEffect, useRef, useState } from "react";
import { Alignment, Fit, Layout, Rive, RuntimeLoader } from "@rive-app/react-webgl2";
import riveWasmUrl from "@rive-app/webgl2/rive.wasm?url";
import { ArrowLeftIcon, ImageIcon, PauseIcon, PlayIcon, RotateCcwIcon, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SizeControl } from "./editor-controls";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import "./citation-editor.css";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { animations, assetSettingLimits, assetSettingsKey, defaultAssetSettings, dimensions, downloadBlob, drawCitation, getAssetSettings, initialCitation, videoMimeType } from "./citation-renderer";

RuntimeLoader.setWasmUrl(riveWasmUrl);
const STORAGE_KEY = "moonvine.citation.v1";

function readDraft() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object") return initialCitation;
    const draft = { ...initialCitation };
    for (const key of ["quote", "author", "attribution"]) {
      if (typeof stored[key] === "string") draft[key] = stored[key].slice(0, key === "quote" ? 500 : 100);
    }
    if (["portrait", "landscape"].includes(stored.orientation)) draft.orientation = stored.orientation;
    if (["light", "dark"].includes(stored.theme)) draft.theme = stored.theme;
    if (typeof stored.showAuthorDetails === "boolean") draft.showAuthorDetails = stored.showAuthorDetails;
    if (animations.some((item) => item.value === stored.animation)) draft.animation = stored.animation;
    for (const [key, min, max] of [["quoteSize", 48, 120], ["authorSize", 20, 52], ["attributionSize", 16, 36], ["duration", 3, 15]]) {
      if (Number.isFinite(stored[key])) draft[key] = Math.max(min, Math.min(max, stored[key]));
    }
    draft.assetSettings = {};
    for (const animation of animations) {
      for (const orientation of ["portrait", "landscape"]) {
        const key = `${animation.value}:${orientation}`;
        const saved = stored.assetSettings?.[key];
        if (!saved || typeof saved !== "object") continue;
        const settings = { ...defaultAssetSettings };
        for (const [name, [min, max]] of Object.entries(assetSettingLimits)) {
          if (Number.isFinite(saved[name])) settings[name] = Math.round(Math.max(min, Math.min(max, saved[name])));
        }
        draft.assetSettings[key] = settings;
      }
    }
    return draft;
  } catch { return initialCitation; }
}

export function CitationEditor() {
  const [draft, setDraft] = useState(readDraft);
  const [playing, setPlaying] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [ready, setReady] = useState(false);
  const [replay, setReplay] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const overflowRef = useRef(false);
  const canvasRef = useRef(null);
  const riveRef = useRef(null);
  const artworkRef = useRef(null);
  const draftRef = useRef(draft);
  const recordingRef = useRef(null);
  const mountedRef = useRef(true);
  const [width, height] = dimensions(draft.orientation);
  const mimeType = videoMimeType();
  const change = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));
  const assetSettings = getAssetSettings(draft);
  const changeAssetSettings = (patch) => setDraft((previous) => ({
    ...previous,
    assetSettings: {
      ...previous.assetSettings,
      [assetSettingsKey(previous)]: { ...getAssetSettings(previous), ...patch },
    },
  }));

  useEffect(() => {
    draftRef.current = draft;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* Editing works without storage. */ }
    if (canvasRef.current) drawCitation(canvasRef.current, draft, artworkRef.current);
  }, [draft]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      recordingRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let startTimer;
    setReady(false);
    setError("");
    const option = animations.find((item) => item.value === draft.animation);
    const artwork = document.createElement("canvas");
    artwork.width = 1084;
    artwork.height = draft.animation === "orbit" ? 892 : 1084;
    // Rive suspends canvases with a zero CSS size. Keep its source surface laid
    // out, but invisible and out of the accessibility tree.
    artwork.setAttribute("aria-hidden", "true");
    artwork.style.cssText = `position:fixed;left:0;top:0;width:${artwork.width}px;height:${artwork.height}px;opacity:0;pointer-events:none;z-index:-1`;
    document.body.appendChild(artwork);
    artworkRef.current = artwork;
    const instance = new Rive({
      canvas: artwork,
      src: option.src,
      artboard: option.artboard,
      autoplay: true,
      autoBind: true,
      stateMachines: "State Machine 1",
      layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
      useOffscreenRenderer: true,
      onLoadError: () => { if (!cancelled) setError("The animation could not load. Use Replay to try again."); },
      onLoad: async () => {
        try {
          await document.fonts.load('600 98px "Nib Pro"');
        } catch {
          if (!cancelled) setError("The brand font could not load. Use Replay to try again.");
          return;
        }
        if (cancelled) return;
        const model = instance.viewModelInstance;
        const stroke = model?.color("Stroke Color");
        const point = model?.color("Point Color");
        const thickness = model?.number("Stroke Thickness");
        const pointSize = model?.number("Point Size");
        if (stroke) stroke.value = 0xfff2f3eb;
        if (point) point.value = 0xfff2f3eb;
        if (thickness) thickness.value = 1;
        if (pointSize) pointSize.value = 8;
        model?.trigger("animationStart")?.trigger();
        const paint = () => {
          if (cancelled) return;
          if (canvasRef.current) {
            const result = drawCitation(canvasRef.current, draftRef.current, artwork);
            if (result.overflow !== overflowRef.current) {
              overflowRef.current = result.overflow;
              setOverflow(result.overflow);
            }
          }
          frame = requestAnimationFrame(paint);
        };
        frame = requestAnimationFrame(paint);
        // Allow the triggered artboard to draw before exposing export actions.
        startTimer = window.setTimeout(() => { if (!cancelled) setReady(true); }, 180);
      },
    });
    riveRef.current = instance;
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      cancelAnimationFrame(frame);
      instance.cleanup();
      artwork.remove();
      artworkRef.current = null;
      riveRef.current = null;
    };
  }, [draft.animation, replay]);

  useEffect(() => {
    if (!ready) return;
    if (playing || recording) riveRef.current?.play();
    else riveRef.current?.pause();
  }, [playing, recording, ready]);

  async function exportImage() {
    setError("");
    try {
      const canvas = canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("The image could not be created. Please try again.");
      downloadBlob(blob, `moonvine-citation-${draft.orientation}.png`);
      setNotice("Image downloaded.");
    } catch (cause) { setError(cause.message); }
  }

  async function exportVideo() {
    if (!mimeType || recordingRef.current) return;
    setError("");
    setNotice("");
    setProgress(0);
    setRecording(true);
    let stream;
    let recorder;
    let timer;
    let ticker;
    let aborted = false;
    try {
      stream = canvasRef.current.captureStream(30);
      recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10_000_000 });
      const chunks = [];
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      await new Promise((resolve, reject) => {
        recorder.onerror = () => reject(new Error("Video export failed. Please try again."));
        recorder.onstop = resolve;
        recordingRef.current = { abort: () => {
          aborted = true;
          if (recorder.state !== "inactive") recorder.stop();
        } };
        const started = performance.now();
        recorder.start();
        riveRef.current?.viewModelInstance?.trigger("animationStart")?.trigger();
        ticker = window.setInterval(() => setProgress(Math.min(99, Math.round((performance.now() - started) / (draft.duration * 10)))), 150);
        timer = window.setTimeout(() => { if (recorder.state !== "inactive") recorder.stop(); }, draft.duration * 1000);
      });
      if (!aborted && mountedRef.current) {
        const blob = new Blob(chunks, { type: recorder.mimeType });
        if (!blob.size) throw new Error("No video frames were captured. Please try again.");
        downloadBlob(blob, `moonvine-citation-${draft.orientation}.${recorder.mimeType.includes("mp4") ? "mp4" : "webm"}`);
        setNotice("Video downloaded.");
      }
    } catch (cause) { if (mountedRef.current) setError(cause.message); }
    finally {
      clearTimeout(timer);
      clearInterval(ticker);
      if (recorder && recorder.state !== "inactive") recorder.stop();
      stream?.getTracks().forEach((track) => track.stop());
      recordingRef.current = null;
      if (mountedRef.current) { setRecording(false); setProgress(0); }
    }
  }

  return <section className="citation-editor">
    <aside aria-label="Citation controls" className="citation-sidebar">
      <div className="shrink-0 border-b p-4">
        <Button variant="ghost" size="sm" render={<a href="#/brand-tools" />}><ArrowLeftIcon /> All tools</Button>
      </div>
      <ScrollArea className="citation-controls" overscrollContain scrollFade>
      <fieldset disabled={recording} className="min-w-0 space-y-8 px-5 py-6">
        <div role="group" aria-labelledby="post-options-heading" className="space-y-5">
          <h2 id="post-options-heading" className="text-sm font-medium">Post Options</h2>
          <Tabs value={draft.theme} onValueChange={(theme) => change("theme", theme)}>
            <TabsList aria-label="Post theme" className="w-full">
              <TabsTab value="light" disabled={recording}>Light</TabsTab>
              <TabsTab value="dark" disabled={recording}>Dark</TabsTab>
            </TabsList>
            <TabsPanel value="light" className="sr-only">Light post appearance</TabsPanel>
            <TabsPanel value="dark" className="sr-only">Dark post appearance</TabsPanel>
          </Tabs>
          <Tabs value={draft.orientation} onValueChange={(value) => change("orientation", value)}>
            <TabsList aria-label="Format" className="w-full">
              <TabsTab value="portrait" disabled={recording}>Portrait</TabsTab>
              <TabsTab value="landscape" disabled={recording}>Landscape</TabsTab>
            </TabsList>
            <TabsPanel value="portrait"><p className="text-xs text-muted-foreground">1080 × 1350 px</p></TabsPanel>
            <TabsPanel value="landscape"><p className="text-xs text-muted-foreground">1350 × 1080 px</p></TabsPanel>
          </Tabs>
        </div>
        <Separator className="-mx-5 data-[orientation=horizontal]:w-[calc(100%+2.5rem)]" />
        <div className="space-y-5">
          <Field><FieldLabel>Citation</FieldLabel><Textarea className="min-h-32 w-full resize-y" value={draft.quote} maxLength={500} onChange={(event) => change("quote", event.target.value)} /></Field>
          <SizeControl label="Citation size" min={48} max={120} value={draft.quoteSize} disabled={recording} description="Long citations resize automatically to fit." onChange={(value) => change("quoteSize", value)} />
          <Separator className="-mx-5 data-[orientation=horizontal]:w-[calc(100%+2.5rem)]" />
          <Field className="flex-row items-center justify-between" disabled={recording}>
            <FieldLabel htmlFor="show-author-details">Show author details</FieldLabel>
            <Switch id="show-author-details" checked={draft.showAuthorDetails} disabled={recording} onCheckedChange={(checked) => change("showAuthorDetails", checked)} />
          </Field>
          {draft.showAuthorDetails && <>
          <Field><FieldLabel>Author</FieldLabel><Input value={draft.author} maxLength={100} onChange={(event) => change("author", event.target.value)} /></Field>
          <SizeControl label="Author size" min={20} max={52} value={draft.authorSize} disabled={recording} onChange={(value) => change("authorSize", value)} />
          <Separator className="-mx-5 data-[orientation=horizontal]:w-[calc(100%+2.5rem)]" />
          <Field><FieldLabel>Attribution</FieldLabel><Input value={draft.attribution} maxLength={100} placeholder="Company or role (optional)" onChange={(event) => change("attribution", event.target.value)} /></Field>
          <SizeControl label="Attribution size" min={16} max={36} value={draft.attributionSize} disabled={recording} onChange={(value) => change("attributionSize", value)} />
          </>}
        </div>

        <Separator className="-mx-5 data-[orientation=horizontal]:w-[calc(100%+2.5rem)]" />
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium">Asset placement</h2>
            <Button variant="ghost" size="sm" disabled={recording} onClick={() => changeAssetSettings(defaultAssetSettings)}>Reset placement</Button>
          </div>
          <SizeControl label="Asset size" min={25} max={200} unit="%" value={assetSettings.size} disabled={recording} onChange={(size) => changeAssetSettings({ size })} />
          <SizeControl label="Horizontal offset" min={-1350} max={1350} value={assetSettings.x} disabled={recording} onChange={(x) => changeAssetSettings({ x })} />
          <SizeControl label="Vertical offset" min={-1350} max={1350} value={assetSettings.y} disabled={recording} onChange={(y) => changeAssetSettings({ y })} />
          <p className="text-xs text-muted-foreground">Adjustments apply to this animation and format. Positive offsets move right and down.</p>
        </div>
        <Separator className="-mx-5 data-[orientation=horizontal]:w-[calc(100%+2.5rem)]" />
        <div className="space-y-5">
          <Field><FieldLabel>Video duration</FieldLabel><Select items={[3, 6, 10, 15].map((value) => ({ value, label: `${value} seconds` }))} value={draft.duration} onValueChange={(value) => value && change("duration", value)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectPopup>{[3, 6, 10, 15].map((value) => <SelectItem key={value} value={value}>{value} seconds</SelectItem>)}</SelectPopup></Select></Field>
          {!mimeType && <p className="text-xs text-muted-foreground">Video recording is unavailable in this browser. Image export is available.</p>}
        </div>
      </fieldset>
      </ScrollArea>
    </aside>
    <section aria-label="Citation preview" className="citation-workspace">
      <header className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <Button variant="outline" disabled={!ready || recording || overflow || !draft.quote.trim()} onClick={exportImage}><ImageIcon /> Export image</Button>
        <Button disabled={!ready || recording || overflow || !mimeType || !draft.quote.trim()} onClick={exportVideo}><VideoIcon /> {recording ? `Exporting ${progress}%` : "Export video"}</Button>
        {recording && <Button variant="ghost" onClick={() => recordingRef.current?.abort()}>Cancel</Button>}
      </header>
      <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-muted/30">
        <div className="flex items-center justify-between border-b px-4 py-3 text-xs text-muted-foreground"><span>Live preview</span><span className="tabular-nums">{width} × {height} px</span></div>
        <div className="flex min-h-80 flex-1 items-center justify-center p-4 md:p-6">
          <canvas ref={canvasRef} width={width} height={height} role="img" aria-label={`Citation: ${draft.quote}${draft.showAuthorDetails ? `. ${draft.author}. ${draft.attribution}` : ""}`} className="block h-auto max-h-[65vh] max-w-full shadow-lg" style={{ aspectRatio: `${width} / ${height}`, width: `min(100%, ${65 * width / height}vh)` }} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-card px-4 py-3">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" disabled={!ready || recording} onClick={() => setPlaying(!playing)}>{playing ? <PauseIcon /> : <PlayIcon />}{playing ? "Pause" : "Play"}</Button>
            <Button variant="ghost" size="sm" disabled={recording} onClick={() => { setPlaying(true); setReplay((value) => value + 1); }}><RotateCcwIcon /> Replay</Button>
          </div>
          <div className="flex items-center gap-3"><span id="animation-label" className="text-xs text-muted-foreground">Animation</span><Select disabled={recording} items={animations} value={draft.animation} onValueChange={(value) => value && change("animation", value)}><SelectTrigger aria-labelledby="animation-label" className="w-40"><SelectValue /></SelectTrigger><SelectPopup>{animations.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectPopup></Select></div>
        </div>
      </div>
      <div className="empty:hidden text-sm" aria-live="polite">{error || overflow ? <p role="alert" className="text-destructive-foreground">{error || "This text has too many lines to fit. Shorten the citation or remove some line breaks before exporting."}</p> : (recording || notice || !ready) ? <p className="text-muted-foreground">{recording ? "Recording your animation. Keep this tab visible until the download starts." : notice || "Loading brand animation…"}</p> : null}</div>
    </section>
  </section>;
}
