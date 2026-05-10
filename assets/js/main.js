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

    