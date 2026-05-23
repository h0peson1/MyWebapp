async function triggerLive() {
  console.log("Triggering streamsaas.live Forgot Password");
  const t0 = Date.now();
  const res = await fetch("https://streamsaas.live/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "streamsaas127@gmail.com" })
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
  console.log("Time:", Date.now() - t0, "ms");
}
triggerLive();
