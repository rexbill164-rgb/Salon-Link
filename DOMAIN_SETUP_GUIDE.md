# 🌐 Connect Your Domain to SalonLink

## What Domain Did You Buy?
**Tell me your domain name** (e.g., `salonlink.com` or `salonlink.gh`) so I can give you exact instructions!

---

## 📋 Two Connection Methods

### **Method 1: Domain Already on Cloudflare** ✅ EASIEST
*Use this if you bought domain through Cloudflare or already transferred it*

#### Steps:
1. **Login to Cloudflare**
   - Go to: https://dash.cloudflare.com
   - Use your Cloudflare account

2. **Navigate to Workers & Pages**
   - Click "Workers & Pages" in left sidebar
   - Find and click **"project-ba6e9ce4"**
   - Click **"Custom domains"** tab

3. **Add Custom Domain**
   - Click **"Set up a custom domain"** button
   - Enter: `yourdomain.com` (or `www.yourdomain.com`)
   - Click **"Continue"**

4. **Wait for Auto-Configuration**
   - ✅ Cloudflare will automatically:
     - Add DNS CNAME record
     - Provision SSL certificate (HTTPS)
     - Activate your domain
   - ⏱️ Takes 2-5 minutes

5. **Test Your Domain**
   - Visit: `https://yourdomain.com`
   - Should show your SalonLink app!

---

### **Method 2: Domain NOT on Cloudflare Yet** ⚠️ MORE STEPS
*Use this if you bought domain from Namecheap, GoDaddy, Google Domains, etc.*

#### Option A: Transfer Domain to Cloudflare (RECOMMENDED)

1. **Add Site to Cloudflare**
   - Go to: https://dash.cloudflare.com
   - Click **"Add a site"**
   - Enter your domain: `yourdomain.com`
   - Choose **FREE plan**
   - Click **"Continue"**

2. **Update Nameservers at Registrar**
   - Cloudflare will show you 2 nameservers:
     ```
     Example:
     alex.ns.cloudflare.com
     roxy.ns.cloudflare.com
     ```
   - Copy these nameservers

3. **Login to Your Domain Registrar**
   - **Namecheap**: Domain List → Manage → Nameservers → Custom DNS
   - **GoDaddy**: My Products → Domains → DNS → Nameservers
   - **Google Domains**: My domains → DNS → Name servers → Custom
   
4. **Paste Cloudflare Nameservers**
   - Replace existing nameservers with Cloudflare's
   - Save changes
   - ⏱️ Wait 1-24 hours for propagation (usually 1-2 hours)

5. **After Nameservers Update**
   - Return to Cloudflare dashboard
   - Domain should show "Active" status
   - Now follow **Method 1** above to connect to Pages

---

#### Option B: Keep Domain at Current Registrar (Manual DNS)

1. **Get Cloudflare Pages DNS Target**
   - Login to: https://dash.cloudflare.com
   - Go to: Workers & Pages → project-ba6e9ce4 → Custom domains
   - Click "Set up a custom domain"
   - Enter your domain
   - Cloudflare will show you what DNS records to add

2. **Add DNS Records at Your Registrar**
   
   **For apex domain (yourdomain.com):**
   ```
   Type: CNAME
   Name: @ (or leave blank)
   Value: project-ba6e9ce4.pages.dev
   TTL: 3600 (or Auto)
   ```
   
   **For www subdomain (www.yourdomain.com):**
   ```
   Type: CNAME
   Name: www
   Value: project-ba6e9ce4.pages.dev
   TTL: 3600 (or Auto)
   ```

3. **Where to Add DNS Records:**
   
   **Namecheap:**
   - Login → Domain List → Manage
   - Advanced DNS tab
   - Click "Add New Record"
   - Add CNAME records above

   **GoDaddy:**
   - Login → My Products → Domains
   - Click DNS button
   - Add CNAME records

   **Google Domains:**
   - Login → My domains → DNS
   - Custom records section
   - Add CNAME records

4. **Wait for DNS Propagation**
   - ⏱️ Takes 5 minutes to 24 hours
   - Usually active within 1 hour

5. **Verify Connection**
   - Check at: https://dnschecker.org
   - Enter your domain
   - Select CNAME type
   - Should show: `project-ba6e9ce4.pages.dev`

---

## 🔐 SSL Certificate (HTTPS)

**Cloudflare provides FREE SSL automatically!**

- ✅ When domain is connected, SSL auto-provisions
- ✅ Your site will be `https://yourdomain.com`
- ✅ HTTP traffic auto-redirects to HTTPS
- ✅ Certificate auto-renews forever

**No action needed from you!**

---

## ⚡ Quick Command Line Method (Alternative)

If you prefer command line and have wrangler configured:

```bash
cd /home/user/webapp
npx wrangler pages domain add yourdomain.com --project-name project-ba6e9ce4
```

Then follow DNS setup instructions that appear.

---

## 🐛 Troubleshooting

### Problem: Domain not connecting after 24 hours
**Solution:**
- Check DNS records at registrar match exactly
- Use https://dnschecker.org to verify DNS propagation
- Make sure nameservers are correct (if using Method 2A)

### Problem: "This site can't be reached"
**Solution:**
- DNS not propagated yet - wait 1-2 more hours
- Check you added CNAME, not A record
- Verify CNAME points to: `project-ba6e9ce4.pages.dev`

### Problem: "SSL certificate error"
**Solution:**
- Wait 5-10 minutes after domain connects
- Cloudflare is provisioning SSL certificate
- Clear browser cache and try again

### Problem: Shows "page not found" on Cloudflare
**Solution:**
- Make sure you added domain in Workers & Pages → project-ba6e9ce4 → Custom domains
- Not in the main Cloudflare DNS section

---

## 📊 After Domain is Connected

### Update Social Media & Marketing
1. Update Instagram bio: `Visit salonlink.com`
2. Update TikTok profile: `Book at salonlink.com`
3. Update business cards/flyers
4. Update Google Business Profile

### Update App URLs (Optional)
After domain works, you can update internal links:

```bash
cd /home/user/webapp
# Update any hardcoded URLs in code if needed
git add -A
git commit -m "Update URLs to custom domain"
git push origin main
npx wrangler pages deploy dist --project-name project-ba6e9ce4
```

---

## 📞 Need Help?

**Tell me:**
1. What domain did you buy? (e.g., `salonlink.com`)
2. Where did you buy it? (Namecheap, GoDaddy, Cloudflare, etc.)
3. What step are you stuck on?

I'll give you exact instructions for your specific situation!

---

## ✅ Success Checklist

Once connected, verify:
- [ ] `https://yourdomain.com` loads SalonLink
- [ ] `https://www.yourdomain.com` also works
- [ ] HTTPS (padlock icon) shows in browser
- [ ] Can register and login
- [ ] Can browse providers
- [ ] Mobile view works perfectly

---

**🎉 Once your domain is live, you're officially launched!**

Update `LAUNCH_CHECKLIST.md` and mark "Domain Setup" as complete!
