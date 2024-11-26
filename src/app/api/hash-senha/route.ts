import bcrypt from 'bcrypt';

export async function GET() {
  const senha = 'adm123';  

  try {
    // Gera o hash da senha com 10 rounds de salting
    const hash = await bcrypt.hash(senha, 10);

    return new Response(JSON.stringify({ hash }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Erro ao gerar hash', { status: 500 });
  }
}