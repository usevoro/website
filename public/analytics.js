// Optional production enhancement; link navigation never waits for analytics.
(() => {
  const script = document.currentScript;
  if (
    !script ||
    location.hostname !== script.dataset.domain ||
    navigator.doNotTrack === '1' ||
    navigator.globalPrivacyControl === true
  ) {
    window.voroBeforeSend = () => false;
    return;
  }
  const fields = {
    download_click: ['platform', 'architecture', 'version'],
    github_click: ['destination'],
    documentation_click: [],
    sample_review_click: [],
    release_notes_click: ['platform', 'architecture'],
    checksum_click: ['platform', 'architecture'],
    scroll_depth: ['percent'],
  };
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  window.voroBeforeSend = (type, payload) => {
    if (type !== 'event' || (payload.name && !Object.hasOwn(fields, payload.name))) return false;
    try {
      const url = new URL(payload.url || '/', location.origin);
      if (url.origin !== location.origin) return false;
      const query = new URLSearchParams();
      for (const key of campaignKeys) {
        const value = url.searchParams.get(key);
        if (value) query.set(key, value.slice(0, 100));
      }
      const result = {};
      for (const key of ['website', 'hostname', 'screen', 'language', 'title'])
        if (payload[key] !== undefined) result[key] = payload[key];
      result.url = url.pathname + (query.size ? `?${query}` : '');
      result.referrer = '';
      if (payload.referrer) {
        const referrer = new URL(payload.referrer);
        if (['https:', 'http:'].includes(referrer.protocol)) result.referrer = referrer.origin;
      }
      if (payload.name) {
        result.name = payload.name;
        result.data = {};
        for (const key of fields[payload.name]) {
          const value = payload.data?.[key];
          if (typeof value === 'string') result.data[key] = value.slice(0, 100);
          else if (typeof value === 'number' && Number.isFinite(value)) result.data[key] = value;
        }
      }
      return result;
    } catch {
      return false;
    }
  };
  function track(name, data) {
    if (typeof window.umami?.track !== 'function') return false;
    try {
      // A blocked request must not cause an unhandled rejection or affect navigation.
      Promise.resolve(window.umami.track(name, data)).catch(() => {});
      return true;
    } catch {
      return false;
    }
  }
  function click(event) {
    if (event.defaultPrevented || (event.type === 'auxclick' && event.button !== 1)) return;
    const link = event.target.closest?.('a[data-voro-event]');
    const name = link?.dataset.voroEvent;
    if (!name || !Object.hasOwn(fields, name)) return;
    const data = {};
    for (const key of fields[name]) {
      const value = link.dataset[key];
      if (value) data[key] = value;
    }
    track(name, data);
  }
  document.addEventListener('click', click);
  document.addEventListener('auxclick', click);
  const sent = new Set();
  let scheduled = false;
  function measure() {
    scheduled = false;
    const height = document.documentElement.scrollHeight;
    if (height <= 0) return;
    const reached = Math.min(100, ((window.scrollY + window.innerHeight) / height) * 100);
    for (const percent of [25, 50, 75, 90]) {
      if (reached >= percent && !sent.has(percent) && track('scroll_depth', { percent }))
        sent.add(percent);
    }
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(measure);
    }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
})();
