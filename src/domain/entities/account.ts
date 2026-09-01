interface AccountProps {
  id: string;
  name: string;
  balance: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  public readonly id: string;
  public readonly name: string;
  public readonly balance: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(props: AccountProps) {
    this.id = props.id;
    this.name = props.name;
    this.balance = props.balance;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
