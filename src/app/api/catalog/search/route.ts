import { NextResponse } from "next/server";
import { PokemonTcgCatalogProvider } from "@/features/catalog/pokemon-tcg-provider";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json([]);
  const results = await new PokemonTcgCatalogProvider().search(query);
  return NextResponse.json(results);
}
