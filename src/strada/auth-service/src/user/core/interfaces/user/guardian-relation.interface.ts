import { GuardianType } from "@prisma/client";

export interface IGuardianRelation {
  guardianId: string;
  minorId: string;
  relationship: GuardianType;
  canRequestRides?: boolean;
  canAcceptRides?: boolean;
}
