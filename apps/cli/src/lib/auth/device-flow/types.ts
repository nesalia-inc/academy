export type AuthFlowResult = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};