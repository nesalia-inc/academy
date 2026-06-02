#!/usr/bin/env node

import { Command } from "commander";
import { login, status, logout, list, byId, create } from "./commands/index.js";

const program = new Command();

program
  .name("cli")
  .version("1.0.0")
  .description("@complete-web-template/cli — Manage your account authentication");

program
  .command("auth", { isDefault: false })
  .description("Authentication commands")
  .addCommand(
    new Command("login")
      .description("Login via device authorization")
      .action(login),
  )
  .addCommand(
    new Command("status")
      .description("Check authentication status")
      .action(status),
  )
  .addCommand(
    new Command("logout")
      .description("Logout and clear credentials")
      .action(logout),
  );

program
  .command("post")
  .description("Manage posts")
  .addCommand(
    new Command("list")
      .description("List all posts")
      .option("--cursor <id>", "Cursor for pagination")
      .option("--limit <number>", "Number of posts to fetch", "20")
      .action((cmd) => {
        list();
      }),
  )
  .addCommand(
    new Command("by-id")
      .description("Get a post by ID")
      .requiredOption("--id <id>", "Post ID")
      .action(function () {
        byId({ id: Number(this.opts().id) });
      }),
  )
  .addCommand(
    new Command("create")
      .description("Create a new post")
      .requiredOption("--title <title>", "Post title")
      .option("--slug <slug>", "Post slug (auto-generated if omitted)")
      .action(function () {
        const opts = this.opts();
        create({ title: opts.title, slug: opts.slug });
      }),
  );

program.parse(process.argv);