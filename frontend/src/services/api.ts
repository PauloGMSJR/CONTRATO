const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  });
  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.mensagem || 'Erro ao comunicar com API');
  }
  if (response.headers.get('content-type')?.includes('application/pdf')) {
    const blob = await response.blob();
    return blob as unknown as T;
  }
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  exportPdf: async (body: unknown) => {
    const pdfBlob = await request<Blob>('/contratos/exportar-pdf', { method: 'POST', body: JSON.stringify(body) });
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contrato.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  }
};
