import { expect, test } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const fixture = (name: string) => JSON.parse(readFileSync(resolve('tests/fixtures/gemini', `${name}.json`), 'utf8'))

const geminiResponse = (reply: unknown) => ({
  candidates: [{ content: { parts: [{ text: JSON.stringify(reply) }], role: 'model' }, finishReason: 'STOP' }],
})

test('customer can browse, filter, chat, add from both paths, and ask store questions', async ({ page }) => {
  await page.route('**/generativelanguage.googleapis.com/**', async (route) => {
    const payload = route.request().postDataJSON() as { contents?: Array<{ parts?: Array<{ text?: string }> }> }
    const latestContent = payload.contents?.at(-1)?.parts?.map((part) => part.text ?? '').join(' ') ?? route.request().postData() ?? ''
    const requestText = latestContent.toLowerCase()
    const reply = requestText.includes('women m denim')
      ? fixture('product-results')
      : requestText.includes('bitcoin')
        ? fixture('unavailable')
        : requestText.includes('discount')
          ? fixture('store-answer')
          : fixture('product-clarification')
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(geminiResponse(reply)) })
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Clothes with a point of view.' })).toBeVisible()
  await expect(page.locator('.category-section h2')).toHaveCount(5)
  await expect(page.locator('.product-card')).toHaveCount(25)
  await expect(page.locator('.product-card img').first()).toHaveAttribute('alt', /.+/)

  await page.getByLabel('Category').selectOption('Jeans')
  await expect(page.locator('.product-card')).toHaveCount(5)
  await page.getByText('Clear filters').click()
  await expect(page.locator('.product-card')).toHaveCount(25)

  await page.getByLabel('Gender').selectOption('Women')
  await expect(page.locator('.product-card')).not.toHaveCount(25)
  await page.getByLabel('Size').selectOption('M')
  await page.getByLabel('Material').selectOption('Denim')
  await expect(page.locator('.product-card')).toHaveCount(1)
  await page.getByText('Clear filters').click()
  await expect(page.locator('.product-card')).toHaveCount(25)

  await page.locator('.product-card').first().getByRole('button', { name: 'Add to cart' }).click()
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.getByRole('heading', { name: 'Cart & invoice' })).toBeVisible()
  await page.getByRole('link', { name: 'Continue shopping' }).click()

  await page.getByRole('button', { name: /ask shopmate/i }).click()
  await page.getByRole('textbox', { name: /message the shopping assistant/i }).fill('I want to buy jeans')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText(/what gender, size, and material/i)).toBeVisible()

  await page.getByRole('textbox', { name: /message the shopping assistant/i }).fill('Women M Denim')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.locator('.chat-result').getByText('Ecru Wide-Leg Jeans')).toBeVisible()
  await expect(page.locator('.chat-result img[alt="Ecru Wide-Leg Jeans"]')).toHaveCount(1)
  await page.locator('.chat-result').getByRole('button', { name: 'Add to cart' }).click()
  await expect(page).toHaveURL(/\/cart$/)
  await expect(page.locator('.cart-line')).toHaveCount(2)
  await expect(page.getByText('Invoice summary')).toBeVisible()
  await expect(page.getByText('Payment is not part of this proof of concept.')).toBeVisible()

  await page.getByRole('textbox', { name: /message the shopping assistant/i }).fill('Is there any discount available?')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText(/no general discount is currently confirmed/i)).toBeVisible()

  await page.getByRole('textbox', { name: /message the shopping assistant/i }).fill('Do you accept Bitcoin?')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.getByText(/information is not available/i).last()).toBeVisible()
  await expect(page.getByRole('button', { name: /payment/i })).toHaveCount(0)
})
