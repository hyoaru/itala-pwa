export interface CreateRequest {
  name: string;
  transaction_type: string;
}

export interface CreateResponse {
  id: string;
}

export interface FindItem {
  id: string;
  name: string;
  transaction_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FindOneResponse extends FindItem {}

export interface FindResponse {
  items: FindItem[];
  next_cursor: string;
}

export interface FindRequest {
  name?: string;
  transaction_type?: string;
  status?: string;
}
