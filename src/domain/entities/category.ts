import { TransactionType } from "@/domain/value-objects";

interface CategoryProps {
  id: string;
  name: string;
  transactionType: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}

export class Category {
  public readonly id: string;
  public readonly name: string;
  public readonly transactionType: TransactionType;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(props: CategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.transactionType = props.transactionType;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
