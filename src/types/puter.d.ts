declare const puter: {
  ai: {
    chat: (
      prompt: string | Array<{ role: string; content: string }>,
      options?: { model?: string; stream?: boolean }
    ) => Promise<{ message: { content: string } }>;
  };
};
