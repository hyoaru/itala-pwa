export interface CreateRequest {
  amount: string;
  account_id: string;
  category_id: string;
  description: string;
  occurred_at: string;
}

export interface CreateResponse {
  id: string;
}

export interface FindItem {
  id: string;
  amount: string;
  type: string;
  account_id: string;
  category_id: string;
  description: string;
  occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface FindOneResponse extends FindItem {}

export interface FindResponse {
  items: FindItem[];
  next_cursor: string;
}

export interface FindRequest {
  type?: string;
  account_id?: string;
  category_id?: string;
  from?: string;
  to?: string;
  cursor?: string;
}
