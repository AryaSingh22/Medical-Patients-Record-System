import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { RecordCreated as RecordCreatedEvent } from "../generated/RecordManager/RecordManager";
import { AccessGranted as AccessGrantedEvent, AccessRevoked as AccessRevokedEvent } from "../generated/AccessManager/AccessManager";
import { Record, AccessGrant } from "../generated/schema";

export function handleRecordCreated(event: RecordCreatedEvent): void {
  const id = event.params.recordId.toString();
  let entity = new Record(id);
  entity.recordId = event.params.recordId;
  entity.patientId = event.params.patientId;
  entity.creator = event.params.creator;
  entity.cid = event.params.cid;
  entity.sha256sum = event.params.sha256sum;
  entity.version = event.params.version as i32;
  entity.createdAt = event.block.timestamp;
  entity.parentRecordId = BigInt.zero();
  entity.save();
}

export function handleAccessGranted(event: AccessGrantedEvent): void {
  const id = event.params.recordId.toString() + ":" + event.params.grantee.toHexString();
  let grant = new AccessGrant(id);
  grant.recordId = event.params.recordId;
  grant.grantee = event.params.grantee;
  grant.purposeCode = event.params.purposeCode;
  grant.expiry = BigInt.fromU64(event.params.expiry);
  grant.active = true;
  grant.save();
}

export function handleAccessRevoked(event: AccessRevokedEvent): void {
  const id = event.params.recordId.toString() + ":" + event.params.grantee.toHexString();
  let grant = AccessGrant.load(id);
  if (grant) {
    grant.active = false;
    grant.save();
  }
}
