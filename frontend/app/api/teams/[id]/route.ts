const API_BASE_URL = process.env.API_URL || "http://localhost:4000";

// GET /api/teams/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${API_BASE_URL}/teams/${params.id}`, {
    cache: "no-store"
  });

  if (!res.ok) {
    return Response.json(
      { message: "Không thể tải thông tin đội bóng" },
      { status: res.status }
    );
  }

  return Response.json(await res.json());
}

// PUT /api/teams/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formData = await req.formData();

  const res = await fetch(`${API_BASE_URL}/teams/${params.id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    return Response.json(
      { message: "Không thể cập nhật đội bóng" },
      { status: res.status }
    );
  }

  return Response.json(await res.json());
}

// DELETE /api/teams/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const res = await fetch(`${API_BASE_URL}/teams/${params.id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return Response.json(
      { message: "Không thể xóa đội bóng" },
      { status: res.status }
    );
  }

  return Response.json({ success: true });
}
