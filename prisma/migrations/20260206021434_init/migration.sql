-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#6366f1',
    "logo" TEXT,
    "headline" TEXT NOT NULL DEFAULT 'Join the waitlist',
    "subheadline" TEXT NOT NULL DEFAULT 'Be the first to know when we launch',
    "buttonText" TEXT NOT NULL DEFAULT 'Join waitlist',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "adminEmail" TEXT NOT NULL,
    "adminSecret" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Signup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referredBy" TEXT,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Signup_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Signup_referralCode_key" ON "Signup"("referralCode");

-- CreateIndex
CREATE INDEX "Signup_projectId_position_idx" ON "Signup"("projectId", "position");

-- CreateIndex
CREATE INDEX "Signup_referralCode_idx" ON "Signup"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Signup_projectId_email_key" ON "Signup"("projectId", "email");
