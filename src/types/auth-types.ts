export type RevokeSessionInput = {
  body: {
    token: string;
  };
    headers?: HeadersInit;
  method?: "POST";
  query?: Record<string, any>;
  params?: Record<string, any>;
  request?: Request;
};

