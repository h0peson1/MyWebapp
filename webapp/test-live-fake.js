async function checkFake() {
  console.log("Triggering streamsaas.live Fake Password");
  const t0 = Date.now();
  const res = await fetch("https://streamsaas.live/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "doesnotexist123xyz@gmail.com" })
  });
  console.log("Status:", res.status);
  console.log("Time:", Date.now() - t0, "ms");
}
checkFake();
