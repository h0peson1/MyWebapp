async function triggerLive() {
  console.log("Triggering streamsaas.live FOR RANDOM EMAIL");
  const t0 = Date.now();
  const res = await fetch("https://streamsaas.live/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "random-test-12345@gmail.com" })
  });
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}
triggerLive();
