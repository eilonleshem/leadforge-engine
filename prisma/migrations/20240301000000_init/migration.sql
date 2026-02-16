-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('FORM', 'CALL');
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('PENDING_OTP', 'VERIFIED', 'QUALIFIED_CALL', 'DUPLICATE', 'INVALID', 'DELIVERED', 'FAILED');
-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('STORM', 'LEAK', 'REPLACE', 'OTHER');
-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('TODAY', 'THIS_WEEK', 'THIS_MONTH');
-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('WEBHOOK', 'EMAIL');
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('SENT', 'FAILED', 'RETRY', 'PENDING');
-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "LeadType" NOT NULL DEFAULT 'FORM',
    "status" "LeadStatus" NOT NULL DEFAULT 'PENDING_OTP',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "zip" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "homeowner" BOOLEAN NOT NULL DEFAULT true,
    "issueType" "IssueType",
    "urgency" "Urgency",
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "campaignId" TEXT,
    "landingPage" TEXT,
    "ipHash" TEXT,
    "userAgent" TEXT,
    "consentTimestamp" TIMESTAMP(3),
    "consentVersion" TEXT,
    "duplicateOfLeadId" TEXT,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Call" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sid" TEXT NOT NULL,
    "fromNumber" TEXT NOT NULL,
    "toNumber" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL,
    "recordingUrl" TEXT,
    "campaignId" TEXT,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "leadId" TEXT,
    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "deliveryType" "DeliveryType" NOT NULL,
    "webhookUrl" TEXT,
    "email" TEXT,
    "pricePerLead" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "coverage" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Delivery" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "responseCode" INTEGER,
    "responseBody" TEXT,
    "leadId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "Lead_phone_zip_idx" ON "Lead"("phone", "zip");
-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");
-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
-- CreateIndex
CREATE INDEX "Lead_type_idx" ON "Lead"("type");
-- CreateIndex
CREATE UNIQUE INDEX "Call_sid_key" ON "Call"("sid");
-- CreateIndex
CREATE INDEX "Call_fromNumber_idx" ON "Call"("fromNumber");
-- CreateIndex
CREATE INDEX "Call_createdAt_idx" ON "Call"("createdAt");
-- CreateIndex
CREATE INDEX "Call_sid_idx" ON "Call"("sid");
-- CreateIndex
CREATE INDEX "Buyer_isActive_idx" ON "Buyer"("isActive");
-- CreateIndex
CREATE INDEX "Delivery_leadId_idx" ON "Delivery"("leadId");
-- CreateIndex
CREATE INDEX "Delivery_buyerId_idx" ON "Delivery"("buyerId");
-- CreateIndex
CREATE INDEX "Delivery_status_idx" ON "Delivery"("status");
-- CreateIndex
CREATE INDEX "Delivery_createdAt_idx" ON "Delivery"("createdAt");
-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
-- CreateIndex
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");
-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_duplicateOfLeadId_fkey" FOREIGN KEY ("duplicateOfLeadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
