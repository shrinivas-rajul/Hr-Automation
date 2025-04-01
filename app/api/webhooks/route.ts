import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  // Get the Clerk webhook secret from environment variables
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!CLERK_WEBHOOK_SECRET) {
    return new Response("Missing Clerk webhook secret", { status: 500 })
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with the webhook secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Invalid webhook signature", { status: 400 })
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data

    // Get the primary email
    const primaryEmail = email_addresses?.[0]?.email_address

    if (id && primaryEmail) {
      try {
        // Create a new user in the database
        await prisma.user.create({
          data: {
            clerkId: id,
            name: `${first_name || ""} ${last_name || ""}`.trim() || "HR User",
            email: primaryEmail,
            title: "HR Manager",
            department: "Human Resources",
          },
        })

        console.log("User created in database:", id)
      } catch (error) {
        console.error("Error creating user in database:", error)
        return new Response("Error creating user in database", { status: 500 })
      }
    }
  }

  return new Response("Webhook received", { status: 200 })
}

