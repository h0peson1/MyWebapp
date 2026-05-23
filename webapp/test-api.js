async function test() {
  console.log("Triggering official 'Forgot Password' API endpoint on Vercel Production...");
  try {
    const res = await fetch("https://webapp-rouge-rho.vercel.app/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "streamsaas127@gmail.com" })
    });
    
    const data = await res.text();
    console.log(`Response Status: ${res.status}`);
    console.log(`Response Data: ${data}`);
  } catch(e) {
    console.error(e);
  }
}
test();
