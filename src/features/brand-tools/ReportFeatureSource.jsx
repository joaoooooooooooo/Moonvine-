import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toCanvas } from "html-to-image";
import { ReportFeature } from "./ReportFeature";

// A fixed viewport keeps report breakpoints and theme independent of the editor.
// The frame stays laid out so charts can measure their containers before capture.
export function ReportFeatureSource({ feature, theme, scenario, onCapture, onError }) {
  const [frameDocument, setFrameDocument] = useState(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!frameDocument) return;
    let cancelled = false;
    const capture = async () => {
      try {
        await frameDocument.fonts.ready;
        await Promise.all(Array.from(sourceRef.current.querySelectorAll("img")).map((img) => img.decode()));
        // Report charts finish their introduction before becoming a post asset.
        await new Promise((resolve) => setTimeout(resolve, 1800));
        if (cancelled) return;
        const canvas = await toCanvas(sourceRef.current, {
          pixelRatio: 2, preferredFontFormat: "woff2",
          // Computed CSS already resolves tokens. Copying every Tailwind custom
          // property to every cell makes large report tables needlessly slow.
          includeStyleProperties: Array.from(getComputedStyle(sourceRef.current)).filter((name) => !name.startsWith("--")),
        });
        const background = getComputedStyle(frameDocument.documentElement).getPropertyValue("--background").trim();
        if (!cancelled) onCapture(canvas, background);
      } catch (cause) {
        if (!cancelled) onError(cause);
      }
    };
    capture();
    return () => { cancelled = true; };
  }, [frameDocument, onCapture, onError]);

  return <>
    <iframe title="Report feature rendering surface" aria-hidden="true" tabIndex={-1}
      style={{ position: "fixed", left: 0, top: 0, width: 1440, height: 2400, border: 0, opacity: 0, pointerEvents: "none", zIndex: -1 }}
      onLoad={async (event) => {
        const doc = event.currentTarget.contentDocument;
        if (doc.documentElement.dataset.initialized) return;
        doc.documentElement.dataset.initialized = "true";
        doc.documentElement.className = theme === "dark" ? "dark" : "";
        try {
          await Promise.all(Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map((style) => new Promise((resolve, reject) => {
            const clone = style.cloneNode(true);
            if (clone.tagName === "LINK") { clone.onload = resolve; clone.onerror = reject; }
            doc.head.appendChild(clone);
            if (clone.tagName !== "LINK") resolve();
          })));
          doc.body.style.cssText = "margin:0;background:transparent";
          if (doc.defaultView?.frameElement?.isConnected) setFrameDocument(doc);
        } catch (cause) { onError(cause); }
      }} srcDoc="<!doctype html><html><head></head><body></body></html>" />
    {frameDocument && createPortal(<div ref={sourceRef} className="report-document font-sans text-foreground" style={{ width: feature.width, padding: 4 }}><ReportFeature value={feature.value} scenario={scenario} /></div>, frameDocument.body)}
  </>;
}
