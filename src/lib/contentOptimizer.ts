export function getTargetParagraphCount(item: any, currentPath: string): number {
  if (!item) return 5;
  
  const idLower = (item.id || "").toLowerCase();
  
  // Teologia: 15 paragraphs
  const isTeologia = 
    currentPath === "/teologia" || 
    idLower === "bibliologia" || 
    idLower === "teontologia" || 
    idLower === "cristologia" || 
    idLower === "pneumatologia" || 
    idLower === "antropologia" || 
    idLower === "soteriologia" || 
    idLower === "escatologia" ||
    (item.lesson === undefined && !item.meaning && !item.type);
    
  if (isTeologia) return 15;
  
  // Dicionário: 5 paragraphs
  const isDictionary = 
    currentPath === "/dicionario" || 
    item.meaning !== undefined;
    
  if (isDictionary) return 5;
  
  // Cursos: 10 paragraphs
  const isCourse = 
    currentPath === "/curso" || 
    item.lesson !== undefined;
    
  if (isCourse) return 10;
  
  // Histórias: 10 paragraphs
  const isStory = 
    currentPath === "/historias" || 
    item.type === "place" || 
    item.type === "character";
    
  if (isStory) return 10;
  
  // Estudos: 10 paragraphs (default/fallback)
  return 10;
}

export function optimizeItemContent(item: any, currentPath: string = ""): string {
  if (!item) return "";
  
  const original = item.content || item.story || item.descricao || item.meaning || "";
  
  // Clean original paragraphs into a neat format with no repetitive boilerplate padding
  const originalParas = original
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);
    
  return originalParas.join("\n\n");
}
