export interface CreateRequest {
  name: string;
}

export interface CreateResponse {
  id: string;
}

export interface FindItem {
  id: string;
  name: string;
  balance: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FindOneResponse extends FindItem {}

export interface FindResponse {
  items: FindItem[];
  next_cursor: string | null;
}

export interface FindRequest {
  name?: string;
  status?: string;
  cursor?: string;
}

export interface UpdateRequest {
  name: string;
  status: string;
}
