import { TransactionType } from "@/domain/value-objects";

interface TransactionProps {
  id: string;
  amount: string;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  description: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Transaction {
  public readonly id: string;
  public readonly amount: string;
  public readonly type: TransactionType;
  public readonly accountId: string;
  public readonly categoryId: string;
  public readonly description: string;
  public readonly occurredAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(props: TransactionProps) {
    this.id = props.id;
    this.amount = props.amount;
    this.type = props.type;
    this.accountId = props.accountId;
    this.categoryId = props.categoryId;
    this.description = props.description;
    this.occurredAt = props.occurredAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
