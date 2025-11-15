const API_BASE_URL = process.env.API_URL || "http://localhost:4000";

// GET /api/teams  → Lấy danh sách teams
export async function GET() {
  const res = await fetch(`${API_BASE_URL}/teams`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json(
      { message: "Không thể tải danh sách đội bóng" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json(data);
}

// POST /api/teams  → Tạo team
export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch(`${API_BASE_URL}/teams`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    return Response.json(
      { message: "Không thể tạo đội bóng" },
      { status: res.status }
    );
  }

  return Response.json(await res.json());
}
