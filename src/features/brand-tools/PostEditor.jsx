import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { Select, SelectGroup, SelectGroupLabel, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SizeControl } from "./editor-controls";
import { assetSettingLimits, defaultAssetSettings, dimensions, downloadBlob } from "./citation-renderer";
import { drawPost, getPostPlacement, initialPost, postLogoSources, postPlacementKey } from "./post-renderer";
import { reportFeatures, reportScenarioOptions } from "./report-features";
import { ReportFeatureSource } from "./ReportFeatureSource";
import "./citation-editor.css";

const STORAGE_KEY = "moonvine.post.v1";
const featureGroups = [...new Set(reportFeatures.map((feature) => feature.group))];
const Divider = () => <Separator className="-mx-5 data-[orientation=horizontal]:w-[calc(100%+2.5rem)]" />;

function readDraft() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored || typeof stored !== "object") return initialPost;
    const draft = { ...initialPost, assetSettings: {} };
    for (const [key, max] of [["heading", 500], ["tagline", 100]]) if (typeof stored[key] === "string") draft[key] = stored[key].slice(0, max);
    for (const [key, values] of [["theme", ["light", "dark"]], ["orientation", ["portrait", "landscape"]], ["feature", reportFeatures.map((item) => item.value)], ["scenario", reportScenarioOptions.map((item) => item.value)]]) if (values.includes(stored[key])) draft[key] = stored[key];
    for (const [key, min, max] of [["headingSize", 32, 120], ["taglineSize", 16, 40], ["logoSize", 120, 280]]) if (Number.isFinite(stored[key])) draft[key] = Math.round(Math.max(min, Math.min(max, stored[key])));
    for (const feature of reportFeatures) for (const orientation of ["portrait", "landscape"]) {
      const key = `${feature.value}:${orientation}`;
      const saved = stored.assetSettings?.[key];
      if (!saved || typeof saved !== "object") continue;
      draft.assetSettings[key] = { ...defaultAssetSettings };
      for (const [name, [min, max]] of Object.entries(assetSettingLimits)) if (Number.isFinite(saved[name])) draft.assetSettings[key][name] = Math.round(Math.max(min, Math.min(max, saved[name])));
    }
    return draft;
  } catch { return initialPost; }
}

export default function PostEditor() {
  const [draft, setDraft] = useState(readDraft);
  const [captured, setCaptured] = useState(null);
  const [logos, setLogos] = useState(null);
  const [captureError, setCaptureError] = useState("");
  const [retry, setRetry] = useState(0);
  const [overflow, setOverflow] = useState(false);
  const [exportError, setExportError] = useState("");
  const [notice, setNotice] = useState("");
  const canvasRef = useRef(null);
  const feature = reportFeatures.find((item) => item.value === draft.feature);
  const captureKey = `${draft.feature}:${draft.theme}:${draft.scenario}:${retry}`;
  const ready = captured?.key === captureKey && !!logos;
  const [width, height] = dimensions(draft.orientation);
  const placement = getPostPlacement(draft);
  const change = (key, value) => setDraft((previous) => ({ ...previous, [key]: value }));
  const changePlacement = (patch) => setDraft((previous) => ({ ...previous, assetSettings: { ...previous.assetSettings, [postPlacementKey(previous)]: { ...getPostPlacement(previous), ...patch } } }));
  const onCapture = useCallback((canvas, background) => { setCaptured({ key: captureKey, canvas, background }); setCaptureError(""); }, [captureKey]);
  const onCaptureError = useCallback(() => setCaptureError("This report feature could not be prepared. Retry to load it again."), []);
  async function exportImage() {
    setExportError("");
    try {
      const blob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("The image could not be created. Please try again.");
      downloadBlob(blob, `moonvine-post-${draft.feature}-${draft.scenario}-${draft.orientation}.png`);
      setNotice("Image downloaded.");
    } catch (cause) { setExportError(cause.message); }
  }

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* Editing works without storage. */ } }, [draft]);
  useEffect(() => { setCaptureError(""); }, [captureKey]);
  useEffect(() => {
    let cancelled = false;
    Promise.all(Object.entries(postLogoSources).map(async ([theme, src]) => {
      const img = new Image(); img.src = src; await img.decode(); return [theme, img];
    })).then(async (images) => {
      await Promise.all([document.fonts.load('600 68px "Nib Pro"'), document.fonts.load('400 28px Geist')]);
      if (!cancelled) setLogos(Object.fromEntries(images));
    }).catch(() => { if (!cancelled) setCaptureError("The brand logo or font could not load. Reload this page to try again."); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const result = drawPost(canvasRef.current, draft, captured.canvas, logos[draft.theme], captured.background);
    setOverflow(result.overflow);
  }, [draft, captured, logos, ready]);

  const exportDisabled = !ready || overflow || !draft.heading.trim();
  const error = captureError || exportError;
  return <section className="citation-editor">
    {captured?.key !== captureKey && <ReportFeatureSource key={captureKey} feature={feature} theme={draft.theme} scenario={draft.scenario} onCapture={onCapture} onError={onCaptureError} />}
    <aside aria-label="Post controls" className="citation-sidebar">
      <div className="shrink-0 border-b p-4"><Button variant="ghost" size="sm" render={<a href="#/brand-tools" />}><ArrowLeftIcon /> All tools</Button></div>
      <ScrollArea className="citation-controls" overscrollContain scrollFade>
        <fieldset className="min-w-0 space-y-8 px-5 py-6">
          <div role="group" aria-labelledby="post-options-heading" className="space-y-5">
            <h2 id="post-options-heading" className="text-sm font-medium">Post Options</h2>
            <Tabs value={draft.theme} onValueChange={(value) => change("theme", value)}>
              <TabsList aria-label="Post theme" className="w-full"><TabsTab value="light">Light</TabsTab><TabsTab value="dark">Dark</TabsTab></TabsList>
              <TabsPanel value="light" className="sr-only">Light post appearance</TabsPanel><TabsPanel value="dark" className="sr-only">Dark post appearance</TabsPanel>
            </Tabs>
            <Tabs value={draft.orientation} onValueChange={(value) => change("orientation", value)}>
              <TabsList aria-label="Format" className="w-full"><TabsTab value="portrait">Portrait</TabsTab><TabsTab value="landscape">Landscape</TabsTab></TabsList>
              <TabsPanel value="portrait"><p className="text-xs text-muted-foreground">1080 × 1350 px</p></TabsPanel><TabsPanel value="landscape"><p className="text-xs text-muted-foreground">1350 × 1080 px</p></TabsPanel>
            </Tabs>
          </div>
          <Divider />
          <div className="space-y-5">
            <Field><FieldLabel>Report scenario</FieldLabel>
              <Select items={reportScenarioOptions} value={draft.scenario} onValueChange={(value) => value && change("scenario", value)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectPopup>{reportScenarioOptions.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectPopup>
              </Select>
            </Field>
            <p className="text-xs text-muted-foreground">Use this scenario's data for all report features.</p>
          </div>
          <Divider />
          <div className="space-y-5">
            <Field><FieldLabel>Heading</FieldLabel><Textarea className="min-h-32 w-full resize-y" value={draft.heading} maxLength={500} onChange={(event) => change("heading", event.target.value)} /></Field>
            <SizeControl label="Heading size" min={32} max={120} value={draft.headingSize} onChange={(value) => change("headingSize", value)} description="Long headings resize automatically to fit." />
          </div>
          <Divider />
          <div className="space-y-5">
            <Field><FieldLabel>Tagline</FieldLabel><Input value={draft.tagline} placeholder="Tagline (optional)" maxLength={100} onChange={(event) => change("tagline", event.target.value)} /></Field>
            <SizeControl label="Tagline size" min={16} max={40} value={draft.taglineSize} onChange={(value) => change("taglineSize", value)} />
            <SizeControl label="Logo size" min={120} max={280} value={draft.logoSize} onChange={(value) => change("logoSize", value)} />
          </div>
          <Divider />
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2"><h2 className="text-sm font-medium">Asset placement</h2><Button variant="ghost" size="sm" onClick={() => changePlacement(defaultAssetSettings)}>Reset placement</Button></div>
            <SizeControl label="Asset size" min={25} max={200} unit="%" value={placement.size} onChange={(size) => changePlacement({ size })} />
            <SizeControl label="Horizontal offset" min={-1350} max={1350} value={placement.x} onChange={(x) => changePlacement({ x })} />
            <SizeControl label="Vertical offset" min={-1350} max={1350} value={placement.y} onChange={(y) => changePlacement({ y })} />
            <p className="text-xs text-muted-foreground">Adjustments apply to this feature and format. Positive offsets move right and down.</p>
          </div>
        </fieldset>
      </ScrollArea>
    </aside>
    <section aria-label="Post preview" className="citation-workspace">
      <header className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <Button variant="outline" disabled={exportDisabled} onClick={exportImage}><ImageIcon /> Export image</Button>
      </header>
      <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-muted/30">
        <div className="flex items-center justify-between border-b px-4 py-3 text-xs text-muted-foreground"><span>Live preview</span><span className="tabular-nums">{width} × {height} px</span></div>
        <div className="flex min-h-80 flex-1 items-center justify-center p-4 md:p-6">
          <canvas ref={canvasRef} width={width} height={height} role="img" aria-label={`Moonvine post: ${draft.heading}. ${draft.tagline}. ${feature.label}`} className="block h-auto max-h-[65vh] max-w-full shadow-lg" style={{ aspectRatio: `${width} / ${height}`, width: `min(100%, ${65 * width / height}vh)` }} />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 border-t bg-card px-4 py-3">
          <div className="flex items-center gap-3"><span id="report-feature-label" className="text-xs text-muted-foreground">Report feature</span>
            <Select items={reportFeatures} value={draft.feature} onValueChange={(value) => value && change("feature", value)}>
              <SelectTrigger aria-labelledby="report-feature-label" className="w-52"><SelectValue /></SelectTrigger>
              <SelectPopup>{featureGroups.map((group) => <SelectGroup key={group}><SelectGroupLabel>{group}</SelectGroupLabel>{reportFeatures.filter((item) => item.group === group).map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup>)}</SelectPopup>
            </Select>
          </div>
        </div>
      </div>
      <div className="empty:hidden text-sm" aria-live="polite">
        {error || overflow ? <div role="alert" className="flex items-center gap-3 text-destructive-foreground">{error || "This heading has too many lines to fit. Shorten it or remove some line breaks before exporting."}{captureError && <Button variant="outline" size="sm" onClick={() => setRetry((value) => value + 1)}>Retry</Button>}</div> : !ready || notice ? <p className="text-muted-foreground">{!ready ? "Preparing report feature…" : notice}</p> : null}
      </div>
    </section>
  </section>;
}
