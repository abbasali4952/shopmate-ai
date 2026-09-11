## One paragraph

Shopmate AI is a frontend-only proof of concept for a customer shopping for clothing online: it presents a five-category product catalogue, supports browsing and gender, size, and material filtering, uses an AI-powered shopping assistant to discover products from natural-language requests and answer generic store-information questions from `kb.md`, and lets the customer add products to a shared cart and view an invoice without payment integration.

## User

The primary user is a customer shopping for clothing online.

## Happy path (this is the three-minute demo)

1. Open the website and see Jeans, Shirts, T-Shirts, Trousers, and Suits with products.
2. Browse products or apply gender, size, and material filters.
3. Open the fixed bottom-right chatbot and ask, "I want to buy jeans."
4. The chatbot identifies missing selection information and asks appropriate follow-up questions; provide gender, size, and material.
5. The chatbot finds matching products in the frontend catalogue and shows their details and images.
6. Select a chatbot result or use its Add to Cart action; the cart is shown.
7. Verify products, quantities, individual prices, subtotal, and total invoice amount.
8. Start a new chat or continue the conversation and ask, "Is there any discount available?" The chatbot answers from `kb.md`.
9. Ask, "When is the end-of-season sale?" The chatbot answers from `kb.md`; no payment is performed.

## Out of scope

Backend; Server; Database; Vector database; External knowledge-base service; User authentication/login; User registration; Payment gateway; Order processing; Real order persistence; Shipping integration; Delivery tracking; Inventory management; Admin portal; Customer accounts; Production e-commerce integrations; Real-time pricing; Real-time inventory; Real-time discount calculation.

## Architecture

- Frontend only. React + TypeScript + Vite. No backend, no server, no database. Product data must be maintained on the frontend. The browser calls Google Gemini directly through LangChain.js (@langchain/google-genai). The API key is read from VITE_GOOGLE_API_KEY — a local .env during development. Do not introduce any backend API, server-side proxy, database, authentication service, or serverless function.
- The website must contain exactly five product categories: Jeans, Shirts, T-Shirts, Trousers, Suits.
- Each category must contain a random number of products between 5 and 10, with at least 25 products total across all five categories.
- Each product must have sufficient product information to support browsing, filtering, chatbot search, product display, and cart/invoice functionality.
- Product images must use publicly accessible image URLs obtained from images available on the internet. The same product images must be usable both by the website product catalogue and by the chatbot results.
- Filters must support gender, size, and material type.
- The website must contain an AI shopping assistant chatbot fixed at the bottom-right corner.
- The chatbot must help customers find products based on natural-language queries.
- When information required to narrow the product search is missing, the chatbot must ask the customer for the missing information, such as gender, size, material type, or other relevant product information.
- The chatbot must show matching product details and product images in the chat/website experience.
- Customers must be able to add a product to the cart either from the normal website product experience or through an Add to Cart action presented by the chatbot.
- Adding a product to the cart must navigate/show the cart page.
- The cart page must display selected products, quantities, individual prices, subtotal, and a total invoice amount.
- No payment integration is required at this moment.
- No login or user registration is required.
- The chatbot must also answer generic store-related customer queries such as "Is there any discount available?", "When is the end of season sale?", "What is your return policy?", or similar questions.
- The answers to generic store-related queries must come exclusively from a static frontend `kb.md` knowledge-base file.
- The `kb.md` file must contain the store information required to answer generic customer queries, such as discounts, sale periods, return policies, shipping information, and FAQs.
- There is no database, vector database, backend, server, or external knowledge-base service integration for `kb.md`.
- The `kb.md` file is a static frontend knowledge source bundled with the application.
- The chatbot must not invent discounts, sale dates, store policies, or other business information that is not available in `kb.md`.
- If information requested by the user is not available in `kb.md`, the chatbot must clearly state that the information is not available rather than inventing an answer.
- ChatService interface; LangChain + Gemini implementation; a fake implementation for tests.
- React-based UI and frontend cart state use the frontend product catalogue and static `kb.md`. Product image URLs must be stored as part of the frontend product data and reused by both the product catalogue/product cards and chatbot results.
- The chatbot has two primary capabilities: (1) Product discovery — understands natural-language product requests, asks for missing product-selection information when necessary, and recommends products from the frontend product catalogue. (2) Generic store queries — answers questions about discounts, sale periods, store policies, shipping information, and FAQs using the static `kb.md` knowledge base.
- There is no backend, server, database, vector database, or external knowledge-base service. GitHub Actions runs automation and GitHub Pages hosts the frontend deployment.

## Functional requirements FR-1 to FR-8, each testable

### FR-1: Product catalogue

The application must provide exactly five categories: Jeans, Shirts, T-Shirts, Trousers, and Suits. Each category must contain between 5 and 10 products, with at least 25 products across the catalogue.

**Acceptance criteria:** A catalogue test finds exactly these five categories, finds 5-10 products in each category, and counts at least 25 products total.

### FR-2: Product information and images

Every product must have category, name, price, gender, available size, material type, description, and a publicly accessible product image URL. The catalogue and product detail view must display the product information and image correctly.

**Acceptance criteria:** A product-data test verifies every required field and a UI test verifies the name, price, attributes, description, and loaded image for a displayed product.

### FR-3: Product filtering

Users must be able to filter the product catalogue by gender, size, and material type, independently and in combination.

**Acceptance criteria:** Each filter changes the displayed products to matching products only; clearing a filter restores eligible products; combining all three filters returns only products matching every selected value.

### FR-4: Product browsing and selection

Users must be able to browse products, view product details, and add a product to the cart from the normal website product experience.

**Acceptance criteria:** A UI test opens a product detail view, adds the product, navigates/shows the cart, and verifies the selected product and quantity.

### FR-5: AI shopping assistant

The website must provide a chatbot fixed at the bottom-right corner. The chatbot must understand natural-language product-search queries and use the frontend product catalogue to identify potentially matching products.

**Acceptance criteria:** The chatbot is visible at the bottom-right and a query such as "I want to buy jeans" produces an appropriate shopping-assistant interaction based on catalogue data.

### FR-6: Clarification and product results

When required product information is missing, the chatbot must ask relevant follow-up questions such as gender, size, or material type. After receiving sufficient information, it must display matching product details and product images and provide an Add to Cart action.

The chatbot must not invent products that do not exist in the frontend product catalogue.

**Acceptance criteria:** A test submits an underspecified query, verifies a relevant clarification, supplies the missing information, verifies catalogue-backed product details and images, and uses Add to Cart successfully.

### FR-7: Cart and invoice

A product added from either the website or chatbot must appear in the same frontend cart. The cart must display selected products, quantities, individual prices, subtotal, and total invoice amount.

**Acceptance criteria:** A test adds products through both entry points and verifies shared contents, quantity changes, subtotal equal to the sum of line totals, and total invoice amount equal to the subtotal.

### FR-8: Generic store queries and knowledge base

The chatbot must answer generic store-related questions such as discounts, end-of-season sales, return policies, shipping information, and FAQs using information from `kb.md`.

Responses must be grounded in the contents of `kb.md`. The chatbot must not invent information that is absent from `kb.md`. If the requested information is not available in `kb.md`, the chatbot must clearly state that the information is not available.

**Acceptance criteria:** Representative questions receive answers matching `kb.md`, while a question with no `kb.md` answer receives an explicit unavailable response and no invented discount, date, policy, or other business fact.

## The model

- Provider: Google Gemini
- Integration: LangChain.js using @langchain/google-genai
- API key: VITE_GOOGLE_API_KEY
- API key source: local `.env` during development
- Model name: `gemma-4-26b-a4b-it`
- Maximum output tokens: 1024
- System prompt location: a dedicated frontend prompt file, for example `src/prompts/shoppingAssistantSystemPrompt.ts`
- The model must distinguish product-search queries, which use the frontend product catalogue, from generic store-related queries, which use `kb.md`.
- The frontend product catalogue and `kb.md` are the sources of truth for their respective domains.
- The model must not invent products, prices, discounts, sale dates, return policies, shipping information, or other store information.

## Quality gates

- TypeScript/build succeeds.
- Unit tests use Vitest + Testing Library.
- Gemini is replaced by a fake ChatService implementation in unit tests.
- Playwright end-to-end tests intercept/mock the Gemini request.
- Tests run on every GitHub push and pull request.
- All tests must pass before deployment.
- GitHub Pages deployment occurs only after successful tests/build.
- No backend/server/database, vector database, or external knowledge-base service is introduced.
- All five product categories are present; at least 25 products exist; every product has a usable image URL.
- Gender, size, and material filters work; website and chatbot can add products to the same cart; cart totals are calculated correctly.
- `kb.md` exists and contains representative store information; generic chatbot questions are answered using `kb.md`; the chatbot does not invent information that is absent from `kb.md`; product recommendations come only from the frontend product catalogue.
- GitHub Actions runs on every push and pull request.
- Deployment occurs through GitHub Pages using GitHub Actions, and tests pass before anything deploys.

## The five tasks

Exactly five tasks build the whole app, in this order, one GitHub issue and one pull request each:

1. **Chat UI shell, unit tests, and the CI workflow that runs them.** Objective: Establish the React/Vite application shell, chatbot UI shell, basic chat interaction structure, unit-testing foundation, and GitHub Actions workflow for unit tests. Completion criteria: testable through the corresponding unit tests and CI workflow.
2. **Product catalogue, product data, filters, product details, and cart/invoice functionality.** Objective: Implement the five-category product catalogue, frontend product data, product images, gender/size/material filtering, product details, cart state, and invoice calculation. Completion criteria: verify at least 25 products, all five categories, filters, product images, cart functionality, and correct totals.
3. **ChatService interface; LangChain + Gemini implementation; a fake implementation for tests; shopping assistant persona and product-search behavior.** Objective: Implement the ChatService abstraction, real Gemini implementation using LangChain.js, fake implementation for tests, shopping assistant system prompt, product-search behavior, clarification flow, and generic store-query behavior using `kb.md`. Completion criteria: verify product discovery, clarification questions, product results, Add to Cart behavior, and `kb.md`-grounded generic queries.
4. **Playwright end-to-end tests with the Gemini call intercepted, wired into CI.** Objective: Add end-to-end coverage for the major customer journey while intercepting the Gemini request so tests do not depend on a live Gemini response. Completion criteria: verify that Playwright tests pass locally and in GitHub Actions.
5. **GitHub Pages deployment, gated on all tests passing.** Objective: Configure GitHub Pages deployment through GitHub Actions. Completion criteria: verify that deployment cannot proceed when required tests/build fail and that the application is successfully deployable to GitHub Pages.

Every task must correspond to exactly one GitHub issue and exactly one pull request. Do not create a sixth task or split these five tasks into additional tasks.

## Acceptance walkthrough

Perform this manual walkthrough in approximately three minutes: load the website; confirm five visible categories, at least 25 available products, and displayed product images; apply gender, size, and material filters separately and together; open the bottom-right chatbot; ask for a product in natural language; verify a missing-information question; supply the missing information; verify matching products with images; add one product from the chatbot and one product from the normal website; open the shared cart and verify selected products plus the calculated invoice total; ask, "Is there any discount available?" and then ask about the end-of-season sale or another store policy; verify both answers use `kb.md`; ask a question absent from `kb.md` and verify no fabricated information; attempt no payment; confirm automated tests pass and the application is deployable to GitHub Pages.
