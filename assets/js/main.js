document.addEventListener('DOMContentLoaded', () => {

      /* -------------------------------------------------------
         SCROLL REVEAL OBSERVER
         ------------------------------------------------------- */
      const revealEls = document.querySelectorAll('.reveal');
      if (revealEls.length) {
        const revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12 }
        );
        revealEls.forEach(el => revealObserver.observe(el));
      }

      /* -------------------------------------------------------
         NAVBAR — SCROLL STATE
         ------------------------------------------------------- */
      const navbar = document.getElementById('navbar');
      const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // run once on load

      /* -------------------------------------------------------
         NAVBAR — ACTIVE LINK on scroll
         ------------------------------------------------------- */
      const sections = ['features', 'get-token', 'pricing', 'contact'];
      const navLinks = document.querySelectorAll('.navbar__link');

      const sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              navLinks.forEach(l => l.classList.remove('active'));
              const active = document.querySelector(`.navbar__link[href="#${entry.target.id}"]`);
              if (active) active.classList.add('active');
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px' }
      );

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
      });

      /* -------------------------------------------------------
         HAMBURGER MENU — TOGGLE
         ------------------------------------------------------- */
      const hamburgerBtn = document.getElementById('hamburger-btn');
      const mobileMenu = document.getElementById('mobile-menu');

      const closeMobileMenu = () => {
        hamburgerBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      hamburgerBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        hamburgerBtn.classList.toggle('open', isOpen);
        hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on mobile link click
      document.querySelectorAll('.navbar__mobile-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
          closeMobileMenu();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
      });

      /* -------------------------------------------------------
         COPY BUTTONS — code blocks
         ------------------------------------------------------- */
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-copy-target');
          const pre = document.getElementById(targetId);
          if (!pre) return;
          const text = pre.innerText;
          navigator.clipboard.writeText(text).then(() => {
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 2000);
          }).catch(() => {
            // fallback for non-HTTPS
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
          });
        });
      });

      /* -------------------------------------------------------
         INTERACTIVE DEMO CHAT WIDGET
         ------------------------------------------------------- */
      const demoBubble = document.getElementById('demo-bubble-btn');
      const demoChatWin = document.getElementById('demo-chat-window');
      const demoCloseBtn = document.getElementById('demo-close-btn');
      const demoMessages = document.getElementById('demo-messages');
      const demoInput = document.getElementById('demo-chat-input');
      const demoSendBtn = document.getElementById('demo-send-btn');
      const demoTyping = document.getElementById('demo-typing');

      if (demoBubble && demoChatWin) {
        // Toggle chat window
        const openChat = () => {
          demoChatWin.classList.add('open');
          demoBubble.setAttribute('aria-expanded', 'true');
          demoBubble.classList.add('hidden');
          setTimeout(() => demoInput && demoInput.focus(), 300);
        };
        const closeChat = () => {
          demoChatWin.classList.remove('open');
          demoBubble.setAttribute('aria-expanded', 'false');
          demoBubble.classList.remove('hidden');
        };

        demoBubble.addEventListener('click', openChat);
        demoCloseBtn && demoCloseBtn.addEventListener('click', closeChat);

        // Scripted AI responses
        const responses = [
          "SiteAgent reads your entire website automatically and answers visitor questions in real time — no manual training needed! 🤖",
          "We have 3 plans: Free (200 req/mo, 10 pages), Pro at $19/mo (10,000 req, 50 pages), and Agency at $49/mo (50,000 req, 200 pages, 5 websites). Which fits you best?",
          "Setup takes under 5 minutes. Subscribe on MCPize, generate a token with one command, then paste one script tag into your site. That's it!",
          "Yes! SiteAgent works on WordPress, Shopify, Webflow, Wix, Squarespace, Next.js, and plain HTML — anywhere you can paste a script tag.",
          "The free plan includes 200 requests per month, crawling up to 10 pages, and no credit card required. A great way to try it out!",
          "Great question! Pro re-crawls daily and Agency re-crawls hourly, so your chatbot always has the latest content. 🔄",
        ];
        let responseIndex = 0;

        const addMessage = (text, role) => {
          const msg = document.createElement('div');
          msg.className = `demo-msg demo-msg-${role}`;
          msg.textContent = text;
          demoMessages.appendChild(msg);
          demoMessages.scrollTop = demoMessages.scrollHeight;
        };

        const sendMessage = () => {
          const text = demoInput.value.trim();
          if (!text) return;
          addMessage(text, 'user');
          demoInput.value = '';

          // Show typing indicator
          demoTyping.classList.add('active');
          demoMessages.scrollTop = demoMessages.scrollHeight;

          setTimeout(() => {
            demoTyping.classList.remove('active');
            const reply = responses[responseIndex % responses.length];
            responseIndex++;
            addMessage(reply, 'bot');
          }, 1400);
        };

        demoSendBtn && demoSendBtn.addEventListener('click', sendMessage);
        demoInput && demoInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') sendMessage();
        });
      }

      /* -------------------------------------------------------
         FAQ ACCORDION
         ------------------------------------------------------- */
      const faqItems = document.querySelectorAll('.faq-item');
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');
        question.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all
          faqItems.forEach(faq => {
            faq.classList.remove('open');
            const icon = faq.querySelector('.faq-item__icon');
            if (icon) icon.textContent = '+';
          });

          // Open clicked if it wasn't already open
          if (!isOpen) {
            item.classList.add('open');
            const icon = item.querySelector('.faq-item__icon');
            if (icon) icon.textContent = '−';
          }
        });
      });

      /* -------------------------------------------------------
         CONTACT FORM SUBMISSION
         ------------------------------------------------------- */
      const contactForm = document.getElementById('contact-form');
      const formSuccess = document.getElementById('form-success');
      if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
          // Allow the default mailto action to occur, but show the success message
          setTimeout(() => {
            formSuccess.style.display = 'block';
            contactForm.reset();
          }, 500);
        });
      }


      // Phase 9: Announcement Bar
      const annBar = document.getElementById('announcementBar');
      const closeAnn = document.getElementById('closeAnnouncement');
      if (annBar && closeAnn) {
        if (sessionStorage.getItem('siteagent_announcement_dismissed')) {
          annBar.classList.add('hidden');
          // Adjust navbar if sticky
          document.documentElement.style.setProperty('--nav-top-offset', '0px');
        }
        closeAnn.addEventListener('click', () => {
          annBar.classList.add('hidden');
          sessionStorage.setItem('siteagent_announcement_dismissed', 'true');
        });
      }

      // Phase 9: Scroll Progress & Back to Top
      const progressBar = document.getElementById('scrollProgress');
      const backToTopBtn = document.getElementById('backToTop');

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            // Progress Bar
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / docHeight) * 100;
            if (progressBar) progressBar.style.width = scrolled + '%';

            // Back to top visibility
            if (backToTopBtn) {
              if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
              } else {
                backToTopBtn.classList.remove('visible');
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      });

      if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      // Phase 9: Stats Counter Animation
      const counters = document.querySelectorAll('.count-up');
      const countUp = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();
        const update = (currentTime) => {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentCount = Math.floor(easeProgress * target);
          el.innerText = currentCount.toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.innerText = target.toLocaleString();
          }
        };
        requestAnimationFrame(update);
      };

      const statObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counts = entry.target.querySelectorAll('.count-up');
            counts.forEach(countUp);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      const statsSection = document.getElementById('stats');
      if (statsSection) statObserver.observe(statsSection);

      // Phase 9: Live Server Status
      const statusEl = document.getElementById('serverStatus');
      if (statusEl) {
        const dot = statusEl.querySelector('.status-dot');
        const text = statusEl.querySelector('.status-text');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        fetch('https://wazidhasan-siteagent-mcp.hf.space/api/health', { signal: controller.signal })
          .then(res => {
            clearTimeout(timeoutId);
            if (res.ok) {
              dot.className = 'status-dot online';
              text.innerText = 'All Systems Operational';
            } else {
              throw new Error('Not ok');
            }
          })
          .catch(() => {
            clearTimeout(timeoutId);
            dot.className = 'status-dot offline';
            text.innerText = 'Server Offline';
          });
      }


      // Phase 10: Multilanguage System
      const translations = {
  en: {

    // Token Generator
    token_eyebrow: "GET YOUR TOKEN",
    token_headline: "Generate Your Widget Token Instantly",
    token_subtext: "No terminal needed. Enter your MCPize API key and website URL — get your chatbot snippet in seconds.",
    token_key_label: "Your MCPize API Key",
    token_helper_text: "Get your key at →",
    token_url_label: "Your Website URL",
    token_generate_btn: "Generate My Token →",
    token_loading: "Generating...",
    token_success_title: "✅ Your token is ready!",
    token_success_sub: "Copy the snippet below and paste it into your website's <head> tag.",
    token_copy_token: "Copy Token",
    token_copy_snippet: "Copy Snippet",
    token_reset: "← Generate another token",

    // Demo Section
    demo_eyebrow: "SEE IT LIVE",
    demo_headline: "See it in action",
    demo_subtext: "This is exactly what your visitors will experience on your website.",
    demo_caption: "✦ Powered by your website content — no manual training needed",
    demo_chat_greeting: "👋 Hi! I'm SiteAgent. Ask me anything about this website.",
    demo_chat_question: "What plans do you offer?",
    demo_chat_answer1: "We have 3 plans — Free (200 req/mo), Pro at $19/mo, and Agency at $49/mo. Free plan needs no credit card!",
    demo_chat_answer2: "Would you like to start with the free plan? 🚀",

    // Pricing
    pricing_eyebrow: "PRICING",
    pricing_headline: "Simple, transparent pricing",
    pricing_subtext: "Start free. Upgrade when you're ready. No hidden fees.",
    pricing_footnote: "All plans include a 14-day money-back guarantee. Upgrade or cancel anytime.",
    plan_free_name: "Free",
    plan_free_tagline: "Perfect to get started",
    pricing_cta_free: "Start Free",
    plan_pro_name: "Pro",
    plan_pro_tagline: "For growing websites",
    plan_pro_badge: "Most Popular",
    pricing_cta_pro: "Get Pro",
    plan_agency_name: "Agency",
    plan_agency_tagline: "For agencies and power users",
    pricing_cta_agency: "Get Agency",


    // === DOCS PAGE ENGLISH TRANSLATIONS ===

    docs_step3_title: "Add Snippet to Your Website",
    docs_step3_intro: "Paste this into your website's head tag.",
    docs_step3_note: "⚠️ If the snippet is not working, try removing async from the script tag.",
    docs_step4_title: "Done!",
    docs_step4_intro: "Refresh your website. The chat bubble appears in the bottom-right corner.",
    docs_step4_pill1: "⏱ First visit: 30–60 seconds to crawl",
    docs_step4_pill2: "⚡ After that: instant from cache",
    docs_step4_success: "✅ Your chatbot is live!",
    docs_ts_item1_title: "Chat bubble is not appearing",
    docs_ts_item2_title: "\"Could not extract content\" error",
    docs_ts_item3_title: "Chatbot is giving wrong or outdated answers",
    docs_ts_item4_title: "\"Sorry, something went wrong\"",
    docs_ts_item5_title: "Rate limit reached",
    docs_plans_cta_btn: "Subscribe on MCPize →",
    docs_plans_cta_text: "Ready to get started?",
    docs_customize_title: "Customize Your Chatbot (Optional)",
    docs_customize_sub: "The chatbot works out of the box with just a token. Use these options to match your brand.",
    docs_platforms_title: "Platform-Specific Instructions",
    docs_platforms_sub: "Step-by-step for every major platform",
    docs_status_title: "Server Status",
    docs_status_intro: "Check if the server is running:",
    docs_ts_title: "Troubleshooting",
    docs_plans_title: "Plans and Features",
    docs_hero_eyebrow: "DOCUMENTATION",
    docs_hero_headline: "Get Started with SiteAgent",
    docs_hero_subtext: "Everything you need to add an AI chatbot to your website in under 5 minutes.",
    docs_hero_cta_quickstart: "📖 Quick Start",
    docs_hero_cta_token: "🔑 Generate Token",
    docs_hero_video_title: "▶ SiteAgent — Full Setup Tutorial",
    docs_hero_video_sub: "5 min · Full walkthrough",
    docs_hero_video_watch: "Watch Setup Tutorial",
    docs_hero_video_caption: "▶ Watch: Full Setup Tutorial (5 min)",
    docs_toc_title: "ON THIS PAGE",
    docs_toc_quickstart: "Quick Start",
    docs_toc_token: "Generate Token",
    docs_toc_add: "Add to Website",
    docs_toc_platforms: "Platforms",
    docs_toc_customize: "Customize",
    docs_toc_plans: "Plans & Pricing",
    docs_toc_troubleshooting: "Troubleshooting",
    docs_toc_status: "Server Status",
    docs_sidebar_cta: "Generate Token →",

    docs_qs_eyebrow: "QUICK START",
    docs_qs_title: "Up and running in 4 steps",
    docs_step1_title: "Subscribe on MCPize",
    docs_step1_item1: "Go to: mcpize.com/mcp/siteagent-server",
    docs_step1_item2: "Choose your plan — Free, Pro, or Agency",
    docs_step1_item3: "Click Start Free or Subscribe",
    docs_step1_item4: "After signup, your MCPize API Key appears on screen — starts with sk_",
    docs_step1_note: "💾 Save this key — you need it in Step 2.",

    docs_step2_title: "Generate Your Widget Token",
    docs_step2_intro: "Your token links the chatbot to your specific website.",
    docs_optionA_label: "✅ Option A — Using the Landing Page (No terminal needed)",
    docs_optionA_item1: "Go to: siteagent-server-landing-page.vercel.app",
    docs_optionA_item2: "Scroll to \"Generate Your Widget Token Instantly\" section",
    docs_optionA_item3: "Enter your MCPize API Key (sk_...) and your website URL",
    docs_optionA_item4: "Click \"Generate My Token →\"",
    docs_optionA_item5: "Copy the ready-made snippet — token already filled in",
    docs_optionB_label: "⌨️ Option B — Using Terminal",

    docs_step3_title: "Paste One Snippet & Done",
    docs_step3_intro: "Add this snippet before your closing <head> or <body> tag.",
    docs_step3_note: "⚠️ If the snippet does not work, remove the async attribute from the script tag.",

    docs_step4_title: "You're All Set!",
    docs_step4_intro: "Refresh your website. The chat bubble will appear in the bottom right corner.",
    docs_step4_pill1: "⏱ First visit: 30–60s crawl",
    docs_step4_pill2: "⚡ Afterwards: Instant cache",
    docs_step4_success: "✅ Your chatbot is now live and answering visitor questions!",

    docs_platforms_title: "Platform-Specific Instructions",
    docs_platforms_sub: "Step-by-step guides for common website builders.",
    docs_wp_optionA: "Option A — No coding (recommended):",
    docs_wp_optionA_1: "Install the \"Insert Headers and Footers\" plugin",
    docs_wp_optionA_2: "Go to Settings → Insert Headers and Footers",
    docs_wp_optionA_3: "Paste the snippet into the \"Scripts in Footer\" section",
    docs_wp_optionA_4: "Click Save",
    docs_wp_optionB: "Option B — Manual:",
    docs_wp_optionB_1: "Go to Appearance → Theme Editor → open header.php",
    docs_wp_optionB_2: "Paste the snippet just before the closing",
    docs_wp_optionB_3: "Click Update File",
    docs_shopify_1: "Go to Online Store → Themes → Actions → Edit Code",
    docs_shopify_2: "Open theme.liquid under Layout",
    docs_shopify_3: "Paste the snippet just before the closing",
    docs_shopify_4: "Save",
    docs_webflow_1: "Go to Project Settings → Custom Code tab",
    docs_webflow_2: "Paste the snippet in the Head Code section",
    docs_webflow_3: "Save and Publish",
    docs_wix_1: "Go to Settings → Custom Code",
    docs_wix_2: "Click + Add Custom Code",
    docs_wix_3: "Paste the snippet in the code box",
    docs_wix_4: "Set Place Code in to Head",
    docs_wix_5: "Set Add Code to Pages to All Pages",
    docs_wix_6: "Click Apply",
    docs_sq_1: "Go to Settings → Advanced → Code Injection",
    docs_sq_2: "Paste the snippet into the Header box",
    docs_sq_3: "Save",

    docs_customize_title: "Customize Your Chatbot",
    docs_customize_sub: "The chatbot works out-of-the-box with just the token. Use these options to match your brand.",
    docs_quickref_title: "Quick Reference",
    docs_col_option: "Property",
    docs_col_default: "Default",
    docs_col_required: "Required",
    docs_col_desc: "Description",
    docs_token_desc: "Your unique widget token — copy from Step 2.",
    docs_color_desc: "Theme color for bubble, header, and buttons.",
    docs_position_desc: "Position on screen.",
    docs_theme_desc: "Chat window background style.",
    docs_greeting_desc: "First message shown to visitor when opening.",
    docs_placeholder_desc: "Input box hint text.",
    docs_lead_desc: "Ask for email after 2 messages.",
    docs_examples_title: "Examples",
    docs_example1_title: "Online Shop",
    docs_example2_title: "Developer Docs",
    docs_example3_title: "Agency / Portfolio",

    docs_plans_title: "Plans and Features",
    docs_plans_guarantee: "All plans come with a 14-day money-back guarantee.",
    docs_plans_cta_text: "Ready to get started?",
    docs_plans_cta_sub: "Pick your plan and get your API key instantly.",
    docs_plans_cta_btn: "Subscribe on MCPize →",

    docs_ts_title: "Troubleshooting",
    docs_ts_item1_title: "Chat bubble is not appearing",
    docs_ts_item1_1: "Press F12 → click the Console tab",
    docs_ts_item1_2: "Look for red error messages",
    docs_ts_item1_3: "Ensure the snippet is inside your",
    docs_ts_item1_4: "Check that there are no extra spaces or line breaks",
    docs_ts_item1_5: "Try a hard refresh:",
    docs_ts_item2_title: "\"Could not extract content\" error",
    docs_ts_item2_intro: "The chatbot could not read your website. Check that:",
    docs_ts_item2_1: "Your page has at least 30 words of visible text",
    docs_ts_item2_2: "Your website is publicly accessible (not behind a login)",
    docs_ts_item2_3: "Your site does not require JavaScript to render content",
    docs_ts_item3_title: "Chatbot is giving wrong or outdated answers",
    docs_ts_item3_intro: "Trigger a manual re-crawl:",
    docs_ts_item4_title: "\"Sorry, something went wrong\"",
    docs_ts_item4_content: "Your token has expired (tokens are valid for 1 year). Repeat Step 2 to generate a new token.",
    docs_ts_item4_link: "Generate a new token →",
    docs_ts_item5_title: "Rate limit exceeded",
    docs_ts_item5_content: "You have used all requests for this month. Upgrade at mcpize.com/mcp/siteagent-server or wait until the 1st of next month.",

    docs_status_title: "Server Status",
    docs_status_intro: "Check if the SiteAgent API is online and responding.",
    docs_status_ok: "All systems operational",
    docs_status_checking: "Checking status...",
    docs_status_expected: "Expected Response:",
    docs_support_title: "Need more help?",
    docs_support_email: "Email:",
    docs_support_website: "Landing Page:",

    docs_copy: "Copy",
    docs_copied: "Copied! ✓",

          announcement_text: "🎉 SiteAgent is now live! Start free — no credit card required.",
          announcement_mobile: "🎉 Start free today",
          announcement_cta: "Get Started →",
          nav_features: "Features",
          nav_how_it_works: "How It Works",
          nav_get_token: "Get Token",
          nav_pricing: "Pricing",
          nav_contact: "Contact",
          nav_cta: "Start Free",
          hero_label: "✦ AI-POWERED WEBSITE ASSISTANT",
          hero_headline: "Add an AI Chatbot to Any Website in 5 Minutes",
          hero_subheadline: "SiteAgent reads your website automatically and answers visitor questions in real time — no training, no coding, no hassle.",
          hero_cta_primary: "Start Free",
          hero_cta_secondary: "See How It Works",
          hero_trust_badge: "⚡ Works on WordPress, Shopify, Webflow, Wix, and more — setup in 5 minutes",
          stat_1_label: "Websites Powered",
          stat_2_label: "Questions Answered",
          stat_3_label: "Uptime Guaranteed",
          stat_4_label: "Average Setup Time",
          problem_label: "WITHOUT SITEAGENT",
          problem_headline: "Your visitors have questions. Most leave without answers.",
          problem_1: "Visitors leave because support is slow",
          problem_2: "FAQ pages are buried and hard to find",
          problem_3: "Live chat requires full-time staff",
          problem_4: "Missed questions = missed revenue",
          solution_label: "WITH SITEAGENT",
          solution_1: "AI answers instantly, 24/7 — no staff needed",
          solution_2: "Reads your entire website automatically",
          solution_3: "Setup once, works forever",
          solution_4: "Every question answered = more conversions",
          features_eyebrow: "FEATURES",
          features_headline: "Everything you need. Nothing you don't.",
          features_subtext: "Built for website owners who want results, not complexity.",
          feature_1_title: "Auto-Crawl",
          feature_1_desc: "Reads your entire website automatically — no manual training or setup required.",
          feature_2_title: "Instant Answers",
          feature_2_desc: "AI responds to visitor questions in seconds using your cached site content.",
          feature_3_title: "Fully Customizable",
          feature_3_desc: "Match your brand with custom colors, position, theme, greeting, and placeholder text.",
          feature_4_title: "Lead Capture",
          feature_4_desc: "Automatically collects visitor emails after 2 messages — grow your list on autopilot.",
          feature_5_title: "Auto Re-Crawl",
          feature_5_desc: "Keeps answers accurate and up to date as your website content changes over time.",
          feature_6_title: "Works Everywhere",
          feature_6_desc: "One snippet works on WordPress, Shopify, Webflow, Wix, Next.js, and plain HTML.",
          hiw_eyebrow: "SETUP",
          hiw_headline: "Up and running in 3 steps",
          hiw_subtext: "No developer needed. No complicated dashboard. Just copy, paste, done.",
          hiw_step1_title: "Subscribe on MCPize",
          hiw_step1_desc: "Go to mcpize.com/mcp/siteagent-server, choose your plan, and get your API key instantly after signup.",
          hiw_step2_title: "Generate Your Widget Token",
          hiw_step2_desc: "Run one command in your terminal with your API key and website URL. Your unique token is returned instantly.",
          hiw_step3_title: "Paste One Snippet",
          hiw_step3_desc: "Add one script tag to your website's head section. The chatbot goes live instantly — no server setup, no configuration.",
          demo_eyebrow: "SEE IT LIVE",
          demo_headline: "See it in action",
          demo_subtext: "This is exactly what your visitors will experience on your website.",
          demo_caption: "✦ Powered by your website content — no manual training needed",
          demo_chat_greeting: "👋 Hi! I'm SiteAgent. Ask me anything about this website.",
          demo_chat_question: "What are your pricing plans?",
          demo_chat_answer1: "We have 3 plans — Free (200 req/mo), Pro at /mo, and Agency at /mo. Which fits you best?",
          demo_chat_answer2: "Would you like to start with the free plan? 🚀",
          pricing_eyebrow: "PRICING",
          pricing_headline: "Simple, transparent pricing",
          pricing_subtext: "Start free. Upgrade when you're ready. No hidden fees.",
          pricing_footnote: "All plans include a 14-day money-back guarantee. Upgrade or cancel anytime.",
          plan_free_name: "Free",
          plan_free_tagline: "Perfect to get started",
          plan_pro_name: "Pro",
          plan_pro_tagline: "For growing websites",
          plan_pro_badge: "Most Popular",
          plan_agency_name: "Agency",
          plan_agency_tagline: "For agencies and power users",
          pricing_cta_free: "Start Free",
          pricing_cta_pro: "Get Pro",
          pricing_cta_agency: "Get Agency",
          usecases_eyebrow: "USE CASES",
          usecases_headline: "Built for every kind of website",
          usecases_subtext: "SiteAgent adapts to your content and your audience automatically.",
          usecase_1_title: "Online Shop",
          usecase_1_desc: "Answer product questions, shipping policies, and return procedures 24/7. Convert browsers into buyers without live support staff.",
          usecase_2_title: "Docs & Developer Tools",
          usecase_2_desc: "Let developers and users search your documentation by asking natural language questions. Reduce support tickets instantly.",
          usecase_3_title: "Agency & Portfolio",
          usecase_3_desc: "Capture leads and answer client questions automatically. Qualify prospects before your first call and never miss an inquiry.",
          comparison_eyebrow: "COMPARISON",
          comparison_headline: "Why SiteAgent over the alternatives?",
          comparison_subtext: "Most chatbot tools are expensive, complex, or require manual setup. SiteAgent is different.",
          faq_eyebrow: "FAQ",
          faq_headline: "Frequently Asked Questions",
          faq_subtext: "Everything you need to know before getting started.",
          faq_q1: "Do I need coding skills to use SiteAgent?",
          faq_a1: "No coding skills required. Just copy and paste one snippet into your website's head section. If you can edit a webpage, you can install SiteAgent.",
          faq_q2: "How long does setup take?",
          faq_a2: "Under 5 minutes. Subscribe on MCPize, generate your token with one command, paste the snippet — done. The chatbot goes live instantly.",
          faq_q3: "What website platforms does it work on?",
          faq_a3: "SiteAgent works on every platform — WordPress, Shopify, Webflow, Wix, Squarespace, React, Next.js, and plain HTML.",
          faq_q4: "Does the chatbot need manual training?",
          faq_a4: "No. SiteAgent automatically crawls and reads your website content. There is no manual training, no uploading documents, and no configuration required.",
          faq_q5: "What happens if my website content changes?",
          faq_a5: "SiteAgent re-crawls your website automatically. Free plan re-crawls weekly, Pro daily, and Agency hourly. You can also trigger a manual re-crawl anytime.",
          faq_q6: "Is there a free plan with no credit card required?",
          faq_a6: "Yes. The Free plan gives you 200 requests per month and crawls up to 10 pages — completely free, no credit card required.",
          faq_q7: "How do I get my MCPize API key?",
          faq_a7: "Go to mcpize.com/mcp/siteagent-server, choose any plan including Free, and your API key is shown immediately after signup.",
          contact_eyebrow: "CONTACT",
          contact_headline: "Get in Touch",
          contact_subtext: "Have a question, a feature request, or need help? We'd love to hear from you.",
          contact_name_label: "Your Name",
          contact_name_placeholder: "John Smith",
          contact_email_label: "Email Address",
          contact_email_placeholder: "john@example.com",
          contact_subject_label: "Subject",
          contact_subject_1: "General Inquiry",
          contact_subject_2: "Technical Support",
          contact_subject_3: "Billing",
          contact_subject_4: "Feature Request",
          contact_subject_5: "Partnership",
          contact_message_label: "Message",
          contact_message_placeholder: "Tell us how we can help...",
          contact_submit: "Send Message →",
          contact_success: "✅ Message sent! We'll reply within 24 hours.",
          contact_other_heading: "Other ways to reach us",
          contact_email_label2: "Email Us",
          contact_server_label: "Live Server",
          contact_response_label: "Response Time",
          contact_response_value: "Within 24 hours",
          contact_privacy_note: "🔒 Your message goes directly to our team. No bots, no spam.",
          cta_headline: "Ready to add AI to your website?",
          cta_subtext: "Join for free. No credit card required. Setup in 5 minutes.",
          cta_button: "Start Free Now",
          cta_reassurance: "✦ Free forever plan available · No credit card · Cancel anytime",
          footer_tagline: "AI chatbot for every website.",
          footer_product: "Product",
          footer_support: "Support",
          footer_legal: "Legal",
          footer_subscribe_text: "Start building for free",
          footer_subscribe_btn: "Get Started →",
          footer_copyright: "© 2026 SiteAgent. All rights reserved.",
          footer_made_with: "Built with ❤️ for website owners everywhere.",
          footer_status_ok: "All Systems Operational",
          footer_status_checking: "Checking status...",
          mobile_cta: "Free plan available",
          mobile_cta_btn: "Start Free &rarr;"
        },
        bn: {

    // Token Generator
    token_eyebrow: "আপনার টোকেন নিন",
    token_headline: "এখনই আপনার Widget Token তৈরি করুন",
    token_subtext: "Terminal লাগবে না। আপনার MCPize API Key ও ওয়েবসাইট URL দিন — সেকেন্ডের মধ্যে chatbot snippet পাবেন।",
    token_key_label: "আপনার MCPize API Key",
    token_helper_text: "এখানে আপনার key পান →",
    token_url_label: "আপনার ওয়েবসাইট URL",
    token_generate_btn: "আমার Token তৈরি করুন →",
    token_loading: "তৈরি হচ্ছে...",
    token_success_title: "✅ আপনার token প্রস্তুত!",
    token_success_sub: "নিচের snippet কপি করুন এবং আপনার ওয়েবসাইটের <head> ট্যাগে paste করুন।",
    token_copy_token: "Token কপি করুন",
    token_copy_snippet: "Snippet কপি করুন",
    token_reset: "← আরেকটি token তৈরি করুন",

    // Demo Section
    demo_eyebrow: "লাইভ দেখুন",
    demo_headline: "কীভাবে কাজ করে দেখুন",
    demo_subtext: "আপনার ভিজিটররা ঠিক এটাই অভিজ্ঞতা পাবেন আপনার ওয়েবসাইটে।",
    demo_caption: "✦ আপনার ওয়েবসাইটের কন্টেন্ট দিয়ে চলে — কোনো ম্যানুয়াল ট্রেনিং দরকার নেই",
    demo_chat_greeting: "👋 হ্যালো! আমি SiteAgent। এই ওয়েবসাইট সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন।",
    demo_chat_question: "আপনাদের কোন কোন প্ল্যান আছে?",
    demo_chat_answer1: "আমাদের ৩টি প্ল্যান আছে — Free (২০০ req/মাস), Pro মাত্র $১৯/মাস, এবং Agency $৪৯/মাস। Free প্ল্যানে কোনো ক্রেডিট কার্ড লাগে না!",
    demo_chat_answer2: "বিনামূল্যে প্ল্যান দিয়ে শুরু করতে চান? 🚀",

    // Pricing
    pricing_eyebrow: "মূল্য তালিকা",
    pricing_headline: "সহজ ও স্বচ্ছ মূল্য",
    pricing_subtext: "বিনামূল্যে শুরু করুন। প্রস্তুত হলে আপগ্রেড করুন। কোনো লুকানো চার্জ নেই।",
    pricing_footnote: "সব প্ল্যানে ১৪ দিনের মানি-ব্যাক গ্যারান্টি। যেকোনো সময় আপগ্রেড বা বাতিল করুন।",
    plan_free_name: "বিনামূল্যে",
    plan_free_tagline: "শুরু করার জন্য পারফেক্ট",
    pricing_cta_free: "বিনামূল্যে শুরু",
    plan_pro_name: "Pro",
    plan_pro_tagline: "বড় হওয়া ওয়েবসাইটের জন্য",
    plan_pro_badge: "সবচেয়ে জনপ্রিয়",
    pricing_cta_pro: "Pro নিন",
    plan_agency_name: "Agency",
    plan_agency_tagline: "এজেন্সি ও পাওয়ার ইউজারদের জন্য",
    pricing_cta_agency: "Agency নিন",


    // === DOCS PAGE BENGALI TRANSLATIONS ===
    docs_hero_eyebrow: "ডকুমেন্টেশন",
    docs_hero_headline: "SiteAgent দিয়ে শুরু করুন",
    docs_hero_subtext: "মাত্র ৫ মিনিটে আপনার ওয়েবসাইটে AI চ্যাটবট যোগ করতে যা যা দরকার সব এখানে আছে।",
    docs_hero_cta_quickstart: "📖 দ্রুত শুরু",
    docs_hero_cta_token: "🔑 টোকেন তৈরি করুন",
    docs_hero_video_title: "▶ SiteAgent — সম্পূর্ণ সেটআপ টিউটোরিয়াল",
    docs_hero_video_sub: "৫ মিনিট · সম্পূর্ণ গাইড",
    docs_hero_video_watch: "সেটআপ টিউটোরিয়াল দেখুন",
    docs_hero_video_caption: "▶ দেখুন: সম্পূর্ণ সেটআপ টিউটোরিয়াল (৫ মিনিট)",

    docs_toc_title: "এই পাতায়",
    docs_toc_quickstart: "দ্রুত শুরু",
    docs_toc_token: "টোকেন তৈরি",
    docs_toc_add: "ওয়েবসাইটে যোগ করুন",
    docs_toc_platforms: "প্ল্যাটফর্ম",
    docs_toc_customize: "কাস্টমাইজ",
    docs_toc_plans: "প্ল্যান ও মূল্য",
    docs_toc_troubleshooting: "সমস্যা সমাধান",
    docs_toc_status: "সার্ভার স্ট্যাটাস",
    docs_sidebar_cta: "টোকেন তৈরি করুন →",

    docs_qs_eyebrow: "দ্রুত শুরু",
    docs_qs_title: "৪টি ধাপে শুরু করুন",
    docs_step1_title: "MCPize এ সাবস্ক্রাইব করুন",
    docs_step1_item1: "এই লিংকে যান: mcpize.com/mcp/siteagent-server",
    docs_step1_item2: "আপনার প্ল্যান বেছে নিন — Free, Pro, বা Agency",
    docs_step1_item3: "Start Free বা Subscribe এ ক্লিক করুন",
    docs_step1_item4: "সাইনআপের পর আপনার MCPize API Key দেখাবে — শুরু হবে sk_ দিয়ে",
    docs_step1_note: "💾 এই key সেভ করুন — পরের ধাপে লাগবে।",

    docs_step2_title: "Widget Token তৈরি করুন",
    docs_step2_intro: "আপনার token আপনার ওয়েবসাইটের সাথে চ্যাটবট সংযুক্ত করে।",
    docs_optionA_label: "✅ Option A — Landing Page ব্যবহার করুন (Terminal লাগবে না)",
    docs_optionA_item1: "এই লিংকে যান: siteagent-server-landing-page.vercel.app",
    docs_optionA_item2: "\"আপনার Widget Token তৈরি করুন\" সেকশনে যান",
    docs_optionA_item3: "আপনার MCPize API Key (sk_...) ও ওয়েবসাইট URL দিন",
    docs_optionA_item4: "\"Generate My Token →\" তে ক্লিক করুন",
    docs_optionA_item5: "তৈরি snippet কপি করুন — token আগে থেকেই ভরা আছে",
    docs_optionB_label: "⌨️ Option B — Terminal ব্যবহার করুন",

    docs_step3_title: "ওয়েবসাইটে Snippet যোগ করুন",
    docs_step3_intro: "এটি আপনার ওয়েবসাইটের <head> ট্যাগে paste করুন।",
    docs_step3_note: "⚠️ Snippet কাজ না করলে script ট্যাগ থেকে async সরিয়ে দিন।",

    docs_step4_title: "আপনি সফল!",
    docs_step4_intro: "আপনার ওয়েবসাইট refresh করুন। Chat bubble নিচে-ডানে দেখাবে।",
    docs_step4_pill1: "⏱ প্রথম ভিজিট: ৩০–৬০ সেকেন্ড crawl হবে",
    docs_step4_pill2: "⚡ এরপর: cache থেকে তাৎক্ষণিক উত্তর",
    docs_step4_success: "✅ আপনার চ্যাটবট এখন live এবং ভিজিটরদের প্রশ্নের উত্তর দিচ্ছে!",

    docs_platforms_title: "প্ল্যাটফর্ম-ভিত্তিক নির্দেশনা",
    docs_platforms_sub: "প্রতিটি প্ল্যাটফর্মের জন্য ধাপে ধাপে নির্দেশনা।",
    docs_wp_optionA: "Option A — কোডিং ছাড়া (সুপারিশকৃত):",
    docs_wp_optionA_1: "\"Insert Headers and Footers\" plugin ইনস্টল করুন",
    docs_wp_optionA_2: "Settings → Insert Headers and Footers এ যান",
    docs_wp_optionA_3: "Footer সেকশনে snippet paste করুন",
    docs_wp_optionA_4: "Save করুন",
    docs_wp_optionB: "Option B — ম্যানুয়াল:",
    docs_wp_optionB_1: "Appearance → Theme Editor → header.php খুলুন",
    docs_wp_optionB_2: "</head> লাইনের আগে snippet paste করুন",
    docs_wp_optionB_3: "Update File এ ক্লিক করুন",
    docs_shopify_1: "Online Store → Themes → ... → Edit Code এ যান",
    docs_shopify_2: "layout/theme.liquid খুলুন",
    docs_shopify_3: "</head> এর আগে snippet paste করুন",
    docs_shopify_4: "Save করুন",
    docs_webflow_1: "Project Settings → Custom Code ট্যাবে যান",
    docs_webflow_2: "Head Code সেকশনে snippet paste করুন",
    docs_webflow_3: "Save → Publish করুন",
    docs_wix_1: "Settings → Custom Code এ যান",
    docs_wix_2: "+ Add Custom Code এ ক্লিক করুন",
    docs_wix_3: "Snippet paste করুন",
    docs_wix_4: "Place Code in → Head সেট করুন",
    docs_wix_5: "Add to Pages → All Pages সেট করুন",
    docs_wix_6: "Apply করুন",
    docs_sq_1: "Settings → Advanced → Code Injection এ যান",
    docs_sq_2: "Header ফিল্ডে snippet paste করুন",
    docs_sq_3: "Save করুন",

    docs_customize_title: "আপনার চ্যাটবট কাস্টমাইজ করুন",
    docs_customize_sub: "চ্যাটবট শুধু token দিয়েই কাজ করে। এই options দিয়ে আপনার brand এর সাথে মেলান।",
    docs_quickref_title: "দ্রুত রেফারেন্স",
    docs_col_option: "Option",
    docs_col_default: "Default",
    docs_col_required: "আবশ্যিক",
    docs_col_desc: "বিবরণ",
    docs_token_desc: "আপনার unique widget token — Step 2 থেকে কপি করুন।",
    docs_color_desc: "Chat bubble, header ও বাটনের রং।",
    docs_position_desc: "স্ক্রিনে bubble কোথায় দেখাবে।",
    docs_theme_desc: "Chat window এর background style।",
    docs_greeting_desc: "Chat খুললে visitor যে প্রথম বার্তা দেখে।",
    docs_placeholder_desc: "Message input box এর hint text।",
    docs_lead_desc: "২টি message এর পর email collection form দেখাবে।",
    docs_examples_title: "উদাহরণ",
    docs_example1_title: "অনলাইন শপ",
    docs_example2_title: "ডেভেলপার ডকস",
    docs_example3_title: "এজেন্সি",

    docs_plans_title: "প্ল্যান ও ফিচারসমূহ",
    docs_plans_guarantee: "সব প্ল্যানে ১৪ দিনের মানি-ব্যাক গ্যারান্টি।",
    docs_plans_cta_text: "শুরু করতে প্রস্তুত?",
    docs_plans_cta_sub: "আপনার প্ল্যান বেছে নিন এবং সাথে সাথে API key পান।",
    docs_plans_cta_btn: "MCPize এ সাবস্ক্রাইব করুন →",

    docs_ts_title: "সমস্যা সমাধান",
    docs_ts_item1_title: "Chat bubble দেখা যাচ্ছে না",
    docs_ts_item1_1: "F12 চাপুন → Console ট্যাবে ক্লিক করুন",
    docs_ts_item1_2: "লাল error message খুঁজুন",
    docs_ts_item1_3: "Snippet টি <head> ট্যাগের ভেতরে আছে কিনা নিশ্চিত করুন",
    docs_ts_item1_4: "Token এ কোনো extra space বা line break নেই তা চেক করুন",
    docs_ts_item1_5: "Hard refresh: Ctrl + Shift + R (Windows) বা Cmd + Shift + R (Mac)",
    docs_ts_item2_title: "\"Could not extract content\" error",
    docs_ts_item2_intro: "চ্যাটবট আপনার ওয়েবসাইট পড়তে পারেনি। চেক করুন:",
    docs_ts_item2_1: "আপনার পেজে কমপক্ষে ৩০ শব্দের visible text আছে",
    docs_ts_item2_2: "আপনার ওয়েবসাইট publicly accessible (login এর পিছনে না)",
    docs_ts_item2_3: "আপনার সাইটে content দেখাতে JavaScript লাগে না",
    docs_ts_item3_title: "চ্যাটবট ভুল বা পুরনো উত্তর দিচ্ছে",
    docs_ts_item3_intro: "Manual re-crawl trigger করুন:",
    docs_ts_item4_title: "\"Sorry, something went wrong\"",
    docs_ts_item4_content: "আপনার token মেয়াদ শেষ হয়ে গেছে (token ১ বছর valid)। Step 2 পুনরাবৃত্তি করে নতুন token তৈরি করুন।",
    docs_ts_item4_link: "নতুন token তৈরি করুন →",
    docs_ts_item5_title: "Rate limit শেষ হয়ে গেছে",
    docs_ts_item5_content: "এই মাসের সব request ব্যবহার হয়ে গেছে। mcpize.com/mcp/siteagent-server এ আপগ্রেড করুন অথবা পরের মাসের ১ তারিখ পর্যন্ত অপেক্ষা করুন।",

    docs_status_title: "সার্ভার স্ট্যাটাস",
    docs_status_intro: "সার্ভার চলছে কিনা চেক করুন:",
    docs_status_ok: "সব সিস্টেম চালু আছে",
    docs_status_checking: "স্ট্যাটাস চেক হচ্ছে...",
    docs_status_expected: "প্রত্যাশিত response:",
    docs_support_title: "আরো সাহায্য দরকার?",
    docs_support_email: "ইমেইল করুন:",
    docs_support_website: "ওয়েবসাইট:",

    docs_copy: "কপি",
    docs_copied: "কপি হয়েছে! ✓",

          announcement_text: "🎉 SiteAgent এখন লাইভ! বিনামূল্যে শুরু করুন — কোনো ক্রেডিট কার্ড দরকার নেই।",
          announcement_mobile: "🎉 বিনামূল্যে শুরু করুন",
          announcement_cta: "শুরু করুন &rarr;",
          nav_features: "ফিচার",
          nav_how_it_works: "কীভাবে কাজ করে",
          nav_get_token: "টোকেন পান",
          nav_pricing: "মূল্য",
          nav_contact: "যোগাযোগ",
          nav_cta: "বিনামূল্যে শুরু",
          hero_label: "✦ AI-POWERED WEBSITE ASSISTANT",
          hero_headline: "মাত্র ৫ মিনিটে যেকোনো ওয়েবসাইটে AI চ্যাটবট যোগ করুন",
          hero_subheadline: "SiteAgent স্বয়ংক্রিয়ভাবে আপনার ওয়েবসাইট পড়ে এবং ভিজিটরদের প্রশ্নের উত্তর দেয় — কোনো ট্রেনিং, কোনো কোডিং, কোনো ঝামেলা নেই।",
          hero_cta_primary: "বিনামূল্যে শুরু করুন &nearr;",
          hero_cta_secondary: "কীভাবে কাজ করে দেখুন",
          hero_trust_badge: "⚡ WordPress, Shopify, Webflow, Wix সহ সব প্ল্যাটফর্মে কাজ করে — ৫ মিনিটে সেটআপ",
          stat_1_label: "ওয়েবসাইট পাওয়ার্ড",
          stat_2_label: "প্রশ্নের উত্তর দেওয়া হয়েছে",
          stat_3_label: "আপটাইম গ্যারান্টি",
          stat_4_label: "গড় সেটআপ সময়",
          problem_label: "SiteAgent ছাড়া",
          problem_headline: "আপনার ভিজিটরদের প্রশ্ন আছে। বেশিরভাগ উত্তর না পেয়ে চলে যায়।",
          problem_1: "সাপোর্ট ধীর হওয়ায় ভিজিটররা চলে যায়",
          problem_2: "FAQ পেজ খুঁজে পাওয়া কঠিন",
          problem_3: "লাইভ চ্যাটের জন্য সার্বক্ষণিক স্টাফ দরকার",
          problem_4: "মিসড প্রশ্ন = মিসড আয়",
          solution_label: "SiteAgent দিয়ে",
          solution_1: "AI ২৪/৭ তাৎক্ষণিক উত্তর দেয় — কোনো স্টাফ দরকার নেই",
          solution_2: "স্বয়ংক্রিয়ভাবে পুরো ওয়েবসাইট পড়ে নেয়",
          solution_3: "একবার সেটআপ করুন, চিরকাল কাজ করবে",
          solution_4: "প্রতিটি প্রশ্নের উত্তর = বেশি কনভার্সন",
          features_eyebrow: "ফিচারসমূহ",
          features_headline: "যা দরকার সব আছে। যা দরকার নেই তা নেই।",
          features_subtext: "ফলাফল চান এমন ওয়েবসাইট মালিকদের জন্য তৈরি — জটিলতা ছাড়া।",
          feature_1_title: "অটো-ক্রল",
          feature_1_desc: "স্বয়ংক্রিয়ভাবে পুরো ওয়েবসাইট পড়ে নেয় — কোনো ম্যানুয়াল ট্রেনিং বা সেটআপ দরকার নেই।",
          feature_2_title: "তাৎক্ষণিক উত্তর",
          feature_2_desc: "AI সেকেন্ডের মধ্যে ভিজিটরদের প্রশ্নের উত্তর দেয় আপনার ক্যাশড কন্টেন্ট থেকে।",
          feature_3_title: "সম্পূর্ণ কাস্টমাইজযোগ্য",
          feature_3_desc: "আপনার ব্র্যান্ডের সাথে মিলিয়ে রং, পজিশন, থিম ও গ্রিটিং কাস্টমাইজ করুন।",
          feature_4_title: "লিড ক্যাপচার",
          feature_4_desc: "২টি মেসেজের পর স্বয়ংক্রিয়ভাবে ভিজিটরের ইমেইল সংগ্রহ করে — অটোপাইলটে লিস্ট বাড়ান।",
          feature_5_title: "অটো রি-ক্রল",
          feature_5_desc: "আপনার ওয়েবসাইটের কন্টেন্ট পরিবর্তন হলে স্বয়ংক্রিয়ভাবে আপডেট হয়।",
          feature_6_title: "সর্বত্র কাজ করে",
          feature_6_desc: "একটি স্নিপেট WordPress, Shopify, Webflow, Wix, Next.js ও plain HTML এ কাজ করে।",
          hiw_eyebrow: "সেটআপ",
          hiw_headline: "মাত্র ৩ ধাপে শুরু করুন",
          hiw_subtext: "কোনো ডেভেলপার দরকার নেই। কোনো জটিল ড্যাশবোর্ড নেই। শুধু কপি, পেস্ট, শেষ।",
          hiw_step1_title: "MCPize এ সাবস্ক্রাইব করুন",
          hiw_step1_desc: "mcpize.com/mcp/siteagent-server এ যান, আপনার প্ল্যান বেছে নিন এবং সাইনআপের পরই API key পান।",
          hiw_step2_title: "Widget Token তৈরি করুন",
          hiw_step2_desc: "টার্মিনালে একটি কমান্ড চালান আপনার API key ও ওয়েবসাইট URL দিয়ে। আপনার unique token তৈরি হয়ে যাবে।",
          hiw_step3_title: "একটি Snippet পেস্ট করুন",
          hiw_step3_desc: "ওয়েবসাইটের head সেকশনে একটি script ট্যাগ যোগ করুন। চ্যাটবট সাথে সাথে লাইভ হয়ে যাবে।",
          demo_eyebrow: "লাইভ দেখুন",
          demo_headline: "কীভাবে কাজ করে দেখুন",
          demo_subtext: "আপনার ভিজিটররা ঠিক এটাই অভিজ্ঞতা পাবেন আপনার ওয়েবসাইটে।",
          demo_caption: "✦ আপনার ওয়েবসাইটের কন্টেন্ট দিয়ে চলে — কোনো ম্যানুয়াল ট্রেনিং দরকার নেই",
          demo_chat_greeting: "👋 হ্যালো! আমি SiteAgent। এই ওয়েবসাইট সম্পর্কে যেকোনো কিছু জিজ্ঞেস করুন।",
          demo_chat_question: "আপনাদের কোন কোন প্ল্যান আছে?",
          demo_chat_answer1: "আমাদের ৩টি প্ল্যান আছে — Free (২০০ req/মাস), Pro মাত্র /মাস, এবং Agency /মাস। Free প্ল্যানে কোনো ক্রেডিট কার্ড লাগে না!",
          demo_chat_answer2: "বিনামূল্যে প্ল্যান দিয়ে শুরু করতে চান? 🚀",
          pricing_eyebrow: "মূল্য তালিকা",
          pricing_headline: "সহজ ও স্বচ্ছ মূল্য",
          pricing_subtext: "বিনামূল্যে শুরু করুন। প্রস্তুত হলে আপগ্রেড করুন। কোনো লুকানো চার্জ নেই।",
          pricing_footnote: "সব প্ল্যানে ১৪ দিনের মানি-ব্যাক গ্যারান্টি। যেকোনো সময় আপগ্রেড বা বাতিল করুন।",
          plan_free_name: "বিনামূল্যে",
          plan_free_tagline: "শুরু করার জন্য পারফেক্ট",
          plan_pro_name: "Pro",
          plan_pro_tagline: "বড় হওয়া ওয়েবসাইটের জন্য",
          plan_pro_badge: "সবচেয়ে জনপ্রিয়",
          plan_agency_name: "Agency",
          plan_agency_tagline: "এজেন্সি ও পাওয়ার ইউজারদের জন্য",
          pricing_cta_free: "বিনামূল্যে শুরু",
          pricing_cta_pro: "Pro নিন",
          pricing_cta_agency: "Agency নিন",
          usecases_eyebrow: "ব্যবহারের ক্ষেত্র",
          usecases_headline: "সব ধরনের ওয়েবসাইটের জন্য তৈরি",
          usecases_subtext: "SiteAgent স্বয়ংক্রিয়ভাবে আপনার কন্টেন্ট ও অডিয়েন্সের সাথে মানিয়ে নেয়।",
          usecase_1_title: "অনলাইন শপ",
          usecase_1_desc: "পণ্য, শিপিং ও রিটার্নের প্রশ্নের উত্তর ২৪/৭ দিন। লাইভ সাপোর্ট স্টাফ ছাড়াই ভিজিটরকে ক্রেতায় পরিণত করুন।",
          usecase_2_title: "ডকস ও ডেভেলপার টুলস",
          usecase_2_desc: "ডেভেলপাররা সহজ ভাষায় প্রশ্ন করে ডকুমেন্টেশন খুঁজে পাক। সাপোর্ট টিকেট কমে যাবে।",
          usecase_3_title: "এজেন্সি ও পোর্টফোলিও",
          usecase_3_desc: "স্বয়ংক্রিয়ভাবে লিড ক্যাপচার করুন এবং ক্লায়েন্টের প্রশ্নের উত্তর দিন। প্রথম কলের আগেই প্রসপেক্ট কোয়ালিফাই করুন।",
          comparison_eyebrow: "তুলনা",
          comparison_headline: "কেন অন্যদের চেয়ে SiteAgent বেছে নেবেন?",
          comparison_subtext: "বেশিরভাগ চ্যাটবট টুল ব্যয়বহুল, জটিল বা ম্যানুয়াল সেটআপ লাগে। SiteAgent আলাদা।",
          faq_eyebrow: "সাধারণ জিজ্ঞাসা",
          faq_headline: "প্রায়ই জিজ্ঞাসিত প্রশ্নসমূহ",
          faq_subtext: "শুরু করার আগে যা জানা দরকার সব এখানে আছে।",
          faq_q1: "SiteAgent ব্যবহার করতে কি কোডিং জানতে হবে?",
          faq_a1: "না, কোনো কোডিং দক্ষতা দরকার নেই। শুধু একটি snippet কপি-পেস্ট করুন আপনার ওয়েবসাইটের head সেকশনে। যে কেউ ওয়েবপেজ এডিট করতে পারলেই SiteAgent ইনস্টল করতে পারবেন।",
          faq_q2: "সেটআপ করতে কতক্ষণ লাগে?",
          faq_a2: "৫ মিনিটেরও কম। MCPize এ সাবস্ক্রাইব করুন, একটি কমান্ডে token তৈরি করুন, snippet পেস্ট করুন — শেষ। চ্যাটবট সাথে সাথে লাইভ হয়ে যাবে।",
          faq_q3: "কোন কোন ওয়েবসাইট প্ল্যাটফর্মে কাজ করে?",
          faq_a3: "SiteAgent সব প্ল্যাটফর্মে কাজ করে — WordPress, Shopify, Webflow, Wix, Squarespace, React, Next.js এবং plain HTML।",
          faq_q4: "চ্যাটবটকে কি ম্যানুয়ালি ট্রেন করতে হবে?",
          faq_a4: "না। SiteAgent স্বয়ংক্রিয়ভাবে আপনার ওয়েবসাইটের কন্টেন্ট পড়ে নেয়। কোনো ম্যানুয়াল ট্রেনিং, ডকুমেন্ট আপলোড বা কনফিগারেশন দরকার নেই।",
          faq_q5: "ওয়েবসাইটের কন্টেন্ট পরিবর্তন হলে কী হবে?",
          faq_a5: "SiteAgent স্বয়ংক্রিয়ভাবে আবার ক্রল করবে। Free প্ল্যান সাপ্তাহিক, Pro প্রতিদিন এবং Agency প্রতি ঘণ্টায় আপডেট করে।",
          faq_q6: "কি ক্রেডিট কার্ড ছাড়া বিনামূল্যে প্ল্যান আছে?",
          faq_a6: "হ্যাঁ। Free প্ল্যানে প্রতি মাসে ২০০ রিকোয়েস্ট এবং ১০টি পেজ ক্রল সম্পূর্ণ বিনামূল্যে — কোনো ক্রেডিট কার্ড লাগবে না।",
          faq_q7: "MCPize API key কোথায় পাবো?",
          faq_a7: "mcpize.com/mcp/siteagent-server এ যান, Free সহ যেকোনো প্ল্যান বেছে নিন এবং সাইনআপের পরই API key দেখতে পাবেন।",
          contact_eyebrow: "যোগাযোগ",
          contact_headline: "আমাদের সাথে যোগাযোগ করুন",
          contact_subtext: "কোনো প্রশ্ন, ফিচার রিকোয়েস্ট বা সাহায্য দরকার? আমরা শুনতে চাই।",
          contact_name_label: "আপনার নাম",
          contact_name_placeholder: "রহিম উদ্দিন",
          contact_email_label: "ইমেইল ঠিকানা",
          contact_email_placeholder: "rahim@example.com",
          contact_subject_label: "বিষয়",
          contact_subject_1: "সাধারণ জিজ্ঞাসা",
          contact_subject_2: "টেকনিক্যাল সাপোর্ট",
          contact_subject_3: "বিলিং",
          contact_subject_4: "ফিচার রিকোয়েস্ট",
          contact_subject_5: "পার্টনারশিপ",
          contact_message_label: "বার্তা",
          contact_message_placeholder: "কীভাবে সাহায্য করতে পারি জানান...",
          contact_submit: "বার্তা পাঠান &rarr;",
          contact_success: "✅ বার্তা পাঠানো হয়েছে! আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেবো।",
          contact_other_heading: "অন্যভাবে যোগাযোগ করুন",
          contact_email_label2: "ইমেইল করুন",
          contact_server_label: "লাইভ সার্ভার",
          contact_response_label: "রেসপন্স টাইম",
          contact_response_value: "২৪ ঘণ্টার মধ্যে",
          contact_privacy_note: "🔒 আপনার বার্তা সরাসরি আমাদের টিমের কাছে যায়। কোনো বট নেই, স্প্যাম নেই।",
          cta_headline: "আপনার ওয়েবসাইটে AI যোগ করতে প্রস্তুত?",
          cta_subtext: "বিনামূল্যে যোগ দিন। ক্রেডিট কার্ড লাগবে না। ৫ মিনিটে সেটআপ।",
          cta_button: "এখনই বিনামূল্যে শুরু করুন &rarr;",
          cta_reassurance: "✦ চিরকালের জন্য বিনামূল্যে প্ল্যান · ক্রেডিট কার্ড নেই · যেকোনো সময় বাতিল করুন",
          footer_tagline: "প্রতিটি ওয়েবসাইটের জন্য AI চ্যাটবট।",
          footer_product: "প্রোডাক্ট",
          footer_support: "সাপোর্ট",
          footer_legal: "আইনি",
          footer_subscribe_text: "বিনামূল্যে শুরু করুন",
          footer_subscribe_btn: "শুরু করুন &rarr;",
          footer_copyright: "© ২০২৬ SiteAgent। সর্বস্বত্ব সংরক্ষিত।",
          footer_made_with: "বাংলাদেশ ও বিশ্বের ওয়েবসাইট মালিকদের জন্য ❤️ দিয়ে তৈরি।",
          footer_status_ok: "সব সিস্টেম চালু আছে",
          footer_status_checking: "স্ট্যাটাস চেক হচ্ছে...",
          mobile_cta: "বিনামূল্যে প্ল্যান আছে",
          mobile_cta_btn: "বিনামূল্যে শুরু &rarr;"
        }
      };

      let currentLang = localStorage.getItem('siteagent_lang') || 'en';

      function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('siteagent_lang', lang);
        document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';

        const t = translations[lang];
        const en = translations['en'];
        const get = (key) => (t[key] && t[key] !== '') ? t[key] : en[key];

        // data-i18n elements (inputs use placeholder, others use innerHTML)
        document.querySelectorAll('[data-i18n]').forEach(el => {
          const key = el.getAttribute('data-i18n');
          const val = get(key);
          if (!val) return;
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = val;
          } else if (el.tagName === 'OPTION') {
            el.textContent = val;
          } else {
            el.innerHTML = val;
          }
        });

        const q = (s) => document.querySelector(s);
        const qa = (s) => document.querySelectorAll(s);

        // ── ANNOUNCEMENT BAR ──
        const annDesktop = q('.announcement-bar .desktop-text');
        if (annDesktop) annDesktop.innerHTML = get('announcement_text');
        const annMobile = q('.announcement-bar .mobile-text');
        if (annMobile) annMobile.innerHTML = get('announcement_mobile');

        // ── NAVBAR ──
        const navLinks = qa('a.navbar__link');
        const navKeys = ['nav_features', 'nav_how_it_works', 'nav_get_token', 'nav_pricing', 'nav_contact'];
        navLinks.forEach((el, i) => { if (navKeys[i]) el.innerHTML = get(navKeys[i]); });

        const mobileLinks = qa('a.navbar__mobile-link');
        mobileLinks.forEach((el, i) => { if (navKeys[i]) el.innerHTML = get(navKeys[i]); });

        // navbar CTA - the .btn inside .navbar__cta that is NOT the lang switcher
        const navCtaBtn = q('.navbar__cta a.btn');
        if (navCtaBtn) navCtaBtn.innerHTML = get('nav_cta');

        // ── HERO ──
        const heroEyebrow = q('.hero__eyebrow');
        if (heroEyebrow) heroEyebrow.innerHTML = lang === 'bn'
          ? '✦ &nbsp;AI-চালিত ওয়েবসাইট সহায়তা'
          : '✦ &nbsp;AI-Powered Website Assistant';

        const h1 = q('.hero__headline');
        if (h1) h1.innerHTML = get('hero_headline');

        const heroSub = q('.hero__subheadline');
        if (heroSub) heroSub.innerHTML = get('hero_subheadline');

        const heroCta1 = q('#hero-cta-primary');
        if (heroCta1) heroCta1.innerHTML = get('hero_cta_primary');

        const heroCta2 = q('#hero-cta-secondary');
        if (heroCta2) heroCta2.innerHTML = get('hero_cta_secondary');

        const trustBadge = q('.hero__trust-badge');
        if (trustBadge) trustBadge.innerHTML = get('hero_trust_badge');

        // ── STATS ──
        const statLabels = qa('.stat-label');
        ['stat_1_label', 'stat_2_label', 'stat_3_label', 'stat_4_label'].forEach((k, i) => {
          if (statLabels[i]) statLabels[i].innerHTML = get(k);
        });

        // ── PROBLEM / SOLUTION ──
        const psH2 = q('.prob-sol__headline');
        if (psH2) psH2.innerHTML = get('problem_headline');

        const psLabels = qa('.ps-card__label');
        if (psLabels[0]) psLabels[0].innerHTML = '&#10060; &nbsp;' + get('problem_label');
        if (psLabels[1]) psLabels[1].innerHTML = '&#9989; &nbsp;' + get('solution_label');

        // ── FEATURES ──
        const featLabel = q('#features .section-label');
        if (featLabel) featLabel.innerHTML = '✦ &nbsp;' + get('features_eyebrow');

        const featH2 = q('#features-headline');
        if (featH2) featH2.innerHTML = get('features_headline');

        const featSub = q('#features .section-subtitle');
        if (featSub) featSub.innerHTML = get('features_subtext');

        const fCardTitles = qa('.feature-card__title');
        ['feature_1_title', 'feature_2_title', 'feature_3_title', 'feature_4_title', 'feature_5_title', 'feature_6_title']
          .forEach((k, i) => { if (fCardTitles[i]) fCardTitles[i].innerHTML = get(k); });

        const fCardDescs = qa('.feature-card__desc');
        ['feature_1_desc', 'feature_2_desc', 'feature_3_desc', 'feature_4_desc', 'feature_5_desc', 'feature_6_desc']
          .forEach((k, i) => { if (fCardDescs[i]) fCardDescs[i].innerHTML = get(k); });

        // ── USE CASES ──
        const ucLabel = q('#use-cases .section-label');
        if (ucLabel) ucLabel.innerHTML = '✦ &nbsp;' + get('usecases_eyebrow');

        const ucH2 = q('#use-cases-headline');
        if (ucH2) ucH2.innerHTML = get('usecases_headline');

        const ucSub = q('#use-cases .section-subtitle');
        if (ucSub) ucSub.innerHTML = get('usecases_subtext');

        const ucTitles = qa('.uc-card__title');
        if (ucTitles[0]) ucTitles[0].innerHTML = get('usecase_1_title');
        if (ucTitles[1]) ucTitles[1].innerHTML = get('usecase_2_title');
        if (ucTitles[2]) ucTitles[2].innerHTML = get('usecase_3_title');

        const ucDescs = qa('.uc-card__desc');
        if (ucDescs[0]) ucDescs[0].innerHTML = get('usecase_1_desc');
        if (ucDescs[1]) ucDescs[1].innerHTML = get('usecase_2_desc');
        if (ucDescs[2]) ucDescs[2].innerHTML = get('usecase_3_desc');

        // ── COMPARISON ──
        const cmpLabel = q('.comparison .section-label');
        if (cmpLabel) cmpLabel.innerHTML = get('comparison_eyebrow');

        const cmpH2 = q('.comparison .section-title');
        if (cmpH2) cmpH2.innerHTML = get('comparison_headline');

        const cmpSub = q('.comparison .section-subtitle');
        if (cmpSub) cmpSub.innerHTML = get('comparison_subtext');

        // ── FAQ ──
        const faqLabel = q('#faq .section-label');
        if (faqLabel) faqLabel.innerHTML = '✦ &nbsp;' + get('faq_eyebrow');

        const faqH2 = q('#faq-headline');
        if (faqH2) faqH2.innerHTML = get('faq_headline');

        const faqSub = q('#faq .section-subtitle');
        if (faqSub) faqSub.innerHTML = get('faq_subtext');

        // FAQ items: question div contains text + icon span. Replace text node only.
        const faqItems = qa('.faq-item');
        const faqQKeys = ['faq_q1', 'faq_q2', 'faq_q3', 'faq_q4', 'faq_q5', 'faq_q6', 'faq_q7'];
        const faqAKeys = ['faq_a1', 'faq_a2', 'faq_a3', 'faq_a4', 'faq_a5', 'faq_a6', 'faq_a7'];
        faqItems.forEach((item, i) => {
          const qEl = item.querySelector('.faq-item__question');
          const aEl = item.querySelector('.faq-item__answer');
          if (qEl && faqQKeys[i]) {
            const icon = qEl.querySelector('.faq-item__icon');
            qEl.innerHTML = get(faqQKeys[i]) + (icon ? ' ' + icon.outerHTML : ' <span class="faq-item__icon" aria-hidden="true">+</span>');
          }
          if (aEl && faqAKeys[i]) aEl.innerHTML = get(faqAKeys[i]);
        });

        // ── CONTACT ──
        const contactLabel = q('#contact .section-label');
        if (contactLabel) contactLabel.innerHTML = '✦ &nbsp;' + get('contact_eyebrow');

        const contactH2 = q('#contact-headline');
        if (contactH2) contactH2.innerHTML = get('contact_headline');

        const contactSub = q('#contact .section-subtitle');
        if (contactSub) contactSub.innerHTML = get('contact_subtext');

        const cName = q('#c-name');
        if (cName) cName.placeholder = get('contact_name_placeholder');

        const cEmail = q('#c-email');
        if (cEmail) cEmail.placeholder = get('contact_email_placeholder');

        const cMsg = q('#c-message');
        if (cMsg) cMsg.placeholder = get('contact_message_placeholder');

        const submitBtn = q('.contact-form .btn-submit');
        if (submitBtn) submitBtn.innerHTML = get('contact_submit');

        const formSuccess = q('#form-success');
        if (formSuccess) formSuccess.innerHTML = get('contact_success');

        const contactInfoTitle = q('.contact-info__title');
        if (contactInfoTitle) contactInfoTitle.innerHTML = get('contact_other_heading');

        const contactCardLabels = qa('.contact-card__label');
        if (contactCardLabels[0]) contactCardLabels[0].innerHTML = get('contact_email_label2');
        if (contactCardLabels[1]) contactCardLabels[1].innerHTML = get('contact_server_label');
        if (contactCardLabels[2]) contactCardLabels[2].innerHTML = get('contact_response_label');

        const responseValue = q('.contact-card__value:not(a)');
        if (responseValue) responseValue.innerHTML = get('contact_response_value');

        const contactNote = q('.contact-note');
        if (contactNote) contactNote.innerHTML = get('contact_privacy_note');

        // ── CTA BANNER ──
        const ctaH2 = q('.cta-banner__title');
        if (ctaH2) ctaH2.innerHTML = lang === 'bn'
          ? 'আপনার ওয়েবসাইটে <span class="text-gradient">AI</span> যোগ করতে প্রস্তুত?'
          : 'Ready to add <span class="text-gradient">AI</span> to your website?';

        const ctaDesc = q('.cta-banner__desc');
        if (ctaDesc) ctaDesc.innerHTML = get('cta_subtext');

        const ctaBtn = q('.cta-banner__inner .btn-large');
        if (ctaBtn) ctaBtn.innerHTML = lang === 'bn' ? 'এখনই বিনামূল্যে শুরু করুন →' : 'Start Free Now →';

        const ctaNote = q('.cta-banner__note');
        if (ctaNote) ctaNote.innerHTML = get('cta_reassurance');

        // ── FOOTER ──
        const footerTagline = q('.footer__tagline');
        if (footerTagline) footerTagline.innerHTML = get('footer_tagline');

        const footerCopyright = q('.footer__copyright');
        if (footerCopyright) footerCopyright.innerHTML = get('footer_copyright');

        const footerCredits = q('.footer__credits');
        if (footerCredits) footerCredits.innerHTML = get('footer_made_with');

        // ── MOBILE CTA BAR ──
        const mobileCta = q('.mobile-cta-bar span');
        if (mobileCta) mobileCta.innerHTML = get('mobile_cta');

        const mobileCtaBtn = q('.mobile-cta-bar .btn');
        if (mobileCtaBtn) mobileCtaBtn.innerHTML = get('mobile_cta_btn');

        // ── LANG SWITCHER ──
        const lb = document.getElementById('lang-switcher');
        if (lb) lb.textContent = lang === 'en' ? '\ud83c\udde7\ud83c\udde9 \u09ac\u09be\u0982' : '\ud83c\uddec\ud83c\udde7 EN';

        // ── BODY CLASS ──
        document.body.classList.toggle('lang-bn', lang === 'bn');
      }

      switchLanguage(currentLang);

      // Lang switcher click handler
      const langSwitcherBtn = document.getElementById('lang-switcher');
      if (langSwitcherBtn) {
        langSwitcherBtn.addEventListener('click', () => {
          switchLanguage(currentLang === 'en' ? 'bn' : 'en');
        });
      }

      // Token Generator Logic
      document.getElementById("gen-btn").addEventListener("click", async () => {
        const apiKey = document.getElementById("gen-api-key").value.trim();
        const websiteUrl = document.getElementById("gen-website-url").value.trim();
        const errorEl = document.getElementById("gen-error");
        const resultEl = document.getElementById("gen-result");
        const btn = document.getElementById("gen-btn");

        errorEl.style.display = "none";

        if (!apiKey || !apiKey.startsWith("sk_")) {
          errorEl.textContent = "❌ Please enter a valid MCPize API key (must start with sk_)";
          errorEl.style.display = "block";
          return;
        }
        if (!websiteUrl || !websiteUrl.startsWith("http")) {
          errorEl.textContent = "❌ Please enter a valid website URL (e.g. https://yoursite.com)";
          errorEl.style.display = "block";
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<span class="btn-spinner"></span>Generating...';

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(
            "https://wazidhasan-siteagent-mcp.hf.space/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
              },
              body: JSON.stringify({ website_url: websiteUrl }),
              signal: controller.signal
            }
          );

          clearTimeout(timeout);
          const data = await response.json();

          if (!response.ok || !data.token) {
            throw new Error(data.message || "Token generation failed. Check your API key.");
          }

          const snippet = `<script>
  window.SiteAgent = {
    token: "${data.token}",
    position: "bottom-right",
    theme: "auto"
  };
<\/script>
<script src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js" async><\/script>`;

          document.getElementById("gen-token-value").value = data.token;
          document.getElementById("gen-snippet-code").textContent = snippet;

          document.getElementById("gen-form-fields").style.display = "none";
          btn.style.display = "none";
          errorEl.style.display = "none";
          resultEl.style.display = "block";
          resultEl.style.opacity = "0";
          setTimeout(() => {
            resultEl.style.transition = "opacity 0.5s ease";
            resultEl.style.opacity = "1";
          }, 10);

        } catch (err) {
          errorEl.textContent = err.name === "AbortError"
            ? "❌ Request timed out. Please try again."
            : `❌ ${err.message || "Something went wrong. Please try again."}`;
          errorEl.style.display = "block";
        } finally {
          btn.disabled = false;
          btn.innerHTML = "Generate My Token →";
        }
      });

      // Copy token
      document.getElementById("gen-copy-token").addEventListener("click", () => {
        const token = document.getElementById("gen-token-value").value;
        navigator.clipboard.writeText(token).then(() => {
          const btn = document.getElementById("gen-copy-token");
          const original = btn.textContent;
          btn.textContent = "Copied! ✓";
          btn.style.background = "#10b981";
          btn.style.color = "white";
          setTimeout(() => {
            btn.textContent = original;
            btn.style.background = "";
            btn.style.color = "";
          }, 2000);
        });
      });

      // Copy snippet
      document.getElementById("gen-copy-snippet").addEventListener("click", () => {
        const snippet = document.getElementById("gen-snippet-code").textContent;
        navigator.clipboard.writeText(snippet).then(() => {
          const btn = document.getElementById("gen-copy-snippet");
          btn.textContent = "Snippet Copied! ✓";
          btn.style.background = "#10b981";
          btn.style.color = "white";
          btn.style.borderColor = "#10b981";
          setTimeout(() => {
            btn.textContent = "Copy Snippet";
            btn.style.background = "";
            btn.style.color = "";
            btn.style.borderColor = "";
          }, 2000);
        });
      });

      // Reset form
      document.getElementById("gen-reset").addEventListener("click", () => {
        document.getElementById("gen-result").style.display = "none";
        document.getElementById("gen-form-fields").style.display = "block";
        document.getElementById("gen-btn").style.display = "block";
        document.getElementById("gen-btn").style.opacity = "1";
        document.getElementById("gen-api-key").value = "";
        document.getElementById("gen-website-url").value = "";
        document.getElementById("gen-error").style.display = "none";
      });

      // Show/hide API key
      document.getElementById("gen-key-toggle").addEventListener("click", () => {
        const input = document.getElementById("gen-api-key");
        const btn = document.getElementById("gen-key-toggle");
        input.type = input.type === "password" ? "text" : "password";
        btn.textContent = input.type === "password" ? "👁" : "🙈";
      });

    }); // end DOMContentLoaded

// === DOCS PAGE LOGIC ===
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('docs.html')) {
    // 1. Video Modal
    const playBtn = document.getElementById('docs-play-btn');
    const modal = document.getElementById('docs-modal');
    const closeBtn = document.getElementById('docs-modal-close');
    const iframe = document.getElementById('docs-iframe');
    const YOUTUBE_URL = "https://www.youtube.com/embed/YOUTUBE_VIDEO_ID_HERE?autoplay=1";

    if (playBtn && modal) {
      playBtn.addEventListener('click', () => {
        iframe.src = YOUTUBE_URL;
        modal.style.display = 'flex';
      });

      const closeModal = () => {
        modal.style.display = 'none';
        iframe.src = "";
      };

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
      });
    }

    // 2. TOC Active State
    const tocLinks = document.querySelectorAll('.toc-pill');
    const sections = Array.from(tocLinks).map(link => {
      const id = link.getAttribute('href').substring(1);
      return document.getElementById(id);
    }).filter(el => el);

    if (sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(l => l.classList.remove('toc-active'));
            const active = document.querySelector(`.toc-pill[href="#${entry.target.id}"]`);
            if (active) active.classList.add('toc-active');
          }
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      
      sections.forEach(sec => observer.observe(sec));
    }

    // 4. Docs Token Generator JS
    const genBtnDocs = document.getElementById('gen-btn-docs');
    if (genBtnDocs) {
      genBtnDocs.addEventListener("click", async () => {
        const apiKey = document.getElementById("gen-api-key-docs").value.trim();
        const websiteUrl = document.getElementById("gen-website-url-docs").value.trim();
        const errorEl = document.getElementById("gen-error-docs");
        const resultEl = document.getElementById("gen-result-docs");

        errorEl.style.display = "none";

        if (!apiKey || !apiKey.startsWith("sk_")) {
          errorEl.textContent = "❌ Please enter a valid MCPize API key (must start with sk_)";
          errorEl.style.display = "block";
          return;
        }
        if (!websiteUrl || !websiteUrl.startsWith("http")) {
          errorEl.textContent = "❌ Please enter a valid website URL (e.g. https://yoursite.com)";
          errorEl.style.display = "block";
          return;
        }

        genBtnDocs.disabled = true;
        genBtnDocs.innerHTML = '<span class="btn-spinner"></span>Generating...';

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(
            "https://wazidhasan-siteagent-mcp.hf.space/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey
              },
              body: JSON.stringify({ website_url: websiteUrl }),
              signal: controller.signal
            }
          );

          clearTimeout(timeout);
          const data = await response.json();

          if (!response.ok || !data.token) {
            throw new Error(data.message || "Token generation failed. Check your API key.");
          }

          const snippet = `<script>
  window.SiteAgent = {
    token: "${data.token}",
    position: "bottom-right",
    theme: "auto"
  };
<\/script>
<script src="https://cdn.jsdelivr.net/gh/Webexguru-Hasan/siteagent-widget@v1.0.3/siteagent.js" async><\/script>`;

          document.getElementById("gen-token-value-docs").value = data.token;
          document.getElementById("gen-snippet-code-docs").textContent = snippet;

          document.getElementById("gen-form-fields-docs").style.display = "none";
          genBtnDocs.style.display = "none";
          errorEl.style.display = "none";
          resultEl.style.display = "block";
          resultEl.style.opacity = "0";
          setTimeout(() => {
            resultEl.style.transition = "opacity 0.5s ease";
            resultEl.style.opacity = "1";
          }, 10);

        } catch (err) {
          errorEl.textContent = err.name === "AbortError"
            ? "❌ Request timed out. Please try again."
            : `❌ ${err.message || "Something went wrong. Please try again."}`;
          errorEl.style.display = "block";
        } finally {
          genBtnDocs.disabled = false;
          genBtnDocs.innerHTML = "Generate My Token →";
        }
      });
    }

    // 5. Server Status Fetch logic for docs
    const statusContainer = document.getElementById('docsServerStatus');
    if (statusContainer) {
      const dot = statusContainer.querySelector('.status-dot');
      const text = statusContainer.querySelector('.status-text');
      fetch('https://wazidhasan-siteagent-mcp.hf.space/api/health')
        .then(r => r.json())
        .then(data => {
          if (data.status === 'ok') {
            dot.classList.add('online');
            text.textContent = 'All Systems Operational';
          } else {
            dot.classList.add('offline');
            text.textContent = 'Degraded Performance';
          }
        })
        .catch(() => {
          dot.classList.add('offline');
          text.textContent = 'System Offline';
        });
    }
  }
});

    
// === DOCS PAGE JS ===

// Platform accordion — one open at a time
const docsAccordionHeaders = document.querySelectorAll(
  '#platforms .docs-accordion-header'
);

docsAccordionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.docs-accordion-icon');
    const isOpen = body.classList.contains('open');

    // Close all
    document.querySelectorAll(
      '#platforms .docs-accordion-body'
    ).forEach(b => b.classList.remove('open'));
    document.querySelectorAll(
      '#platforms .docs-accordion-icon'
    ).forEach(i => i.textContent = '+');

    // Open clicked if was closed
    if (!isOpen) {
      body.classList.add('open');
      icon.textContent = '−';
    }
  });
});

// Open WordPress by default
const firstPlatform = document.querySelector(
  '#platforms .docs-accordion-body'
);
const firstIcon = document.querySelector(
  '#platforms .docs-accordion-icon'
);
if (firstPlatform) {
  firstPlatform.classList.add('open');
  if (firstIcon) firstIcon.textContent = '−';
}

// Troubleshooting accordion
const tsHeaders = document.querySelectorAll(
  '#troubleshooting .docs-accordion-header'
);

tsHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.docs-accordion-icon');
    const isOpen = body.classList.contains('open');

    document.querySelectorAll(
      '#troubleshooting .docs-accordion-body'
    ).forEach(b => b.classList.remove('open'));
    document.querySelectorAll(
      '#troubleshooting .docs-accordion-icon'
    ).forEach(i => i.textContent = '+');

    if (!isOpen) {
      body.classList.add('open');
      icon.textContent = '−';
    }
  });
});
