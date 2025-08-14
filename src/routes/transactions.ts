import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import z from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoute(app: FastifyInstance) {
  // Get all transactions
  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const transactions = await knex("transactions")
        .where("session_id", sessionId)
        .select();
      return reply.send({
        transactions,
      });
    }
  );
  // get summary transactions
  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies;
      const summary = await knex("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();
      return reply.send({
        summary,
      });
    }
  );

  // Get a specific transaction by ID
  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = getTransactionParamsSchema.parse(request.params);
      const { sessionId } = request.cookies;
      const transaction = await knex("transactions")
        .where({ session_id: sessionId, id })
        .first();
      if (!transaction) {
        return reply.status(404).send({
          message: "Transaction not found",
        });
      }
      return reply.send({
        transaction,
      });
    }
  );

  // Create a new transaction
  app.post("/", async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string().min(3).max(100),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });
    const { title, amount, type } = createTransactionSchema.parse(request.body);

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie("session_id", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week(7 days)
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId,
    });
    return reply.status(201).send();
  });
}
