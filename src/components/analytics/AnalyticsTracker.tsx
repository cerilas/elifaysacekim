"use client";

import { useEffect, useRef } from "react";

export function AnalyticsTracker({ currentPath }: { currentPath: string }) {
  const pageViewIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    let sessionId = sessionStorage.getItem("elifay_session_id");
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : "session_" + Math.random().toString(36).substring(2);
      sessionStorage.setItem("elifay_session_id", sessionId);
    }

    startTimeRef.current = Date.now();
    pageViewIdRef.current = null;

    const trackPage = async () => {
      try {
        const res = await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            clinic: "elifay",
            url: window.location.href,
            referrer: document.referrer || null,
          }),
        });
        const data = await res.json();
        if (data.id) {
          pageViewIdRef.current = data.id;
        }
      } catch (error) {
        // silent
      }
    };

    trackPage();

    const sendDuration = () => {
      if (!pageViewIdRef.current) return;
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const payload = JSON.stringify({
        pageViewId: pageViewIdRef.current,
        duration,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener("beforeunload", sendDuration);

    return () => {
      window.removeEventListener("beforeunload", sendDuration);
      sendDuration();
    };
  }, [currentPath]);

  return null;
}
