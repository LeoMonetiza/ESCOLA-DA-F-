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
  
  const original = item.content || item.story || item.descricao || "";
  const title = item.title || item.name || "Ensinamento";
  
  const targetCount = getTargetParagraphCount(item, currentPath);
  
  // Clean original paragraphs
  const originalParas = original
    .split(/\n+/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);
    
  const titleLower = title.toLowerCase();
  
  // Customized analogies and simple explanations based on keywords
  let domainIntro = "";
  let domainExample = "";
  let domainBible = "";
  let domainFamily = "";
  
  if (titleLower.includes("bíblia") || titleLower.includes("bibliologia") || titleLower.includes("escritura")) {
    domainIntro = `Para entender de forma muito simples, ${title} funciona como um manual de instruções perfeito de uma fábrica de brinquedos. Assim como a criança lê o manual para saber como brincar com segurança e alegria, nós lemos a Bíblia para conhecer a vontade de Deus. Por exemplo, quando você abre um mapa no seu celular para chegar a um restaurante novo sem se perder, as Escrituras são esse guia de luz para o nosso caminhar de fé diário.`;
    domainExample = `No nosso cotidiano, imagine um estudante que se prepara para uma prova importante. Em vez de inventar as respostas da sua cabeça com base em boatos da internet, ele abre o livro oficial da escola para estudar a verdade garantida. De forma prática, quando guardamos e lemos essa palavra preciosa no nosso dia de trabalho, evitamos cair em conselhos ruins ou atalhos perigosos do dia a dia.`;
    domainBible = `Nas Escrituras Sagradas, Deus escolheu pessoas comuns, como pescadores e agricultores simples, para escrever as Suas palavras com carinho. Ele não usou robôs, mas guiou o coração de cada um deles de forma sobrenatural. O milagre é que, mesmo escrito há milhares de anos por pessoas simples, o livro sagrado faz todo o sentido para nós hoje, como se tivesse sido escrito nesta manhã para acalmar a nossa alma triste.`;
    domainFamily = `Dentro de nossa casa, com nossos parentes, colocar esse ensino em prática é ler um versículo curto na mesa de jantar ou antes de dormir e conversar sobre ele de forma carinhosa. Por exemplo, quando um pai senta com seu filho pequeno para contar a história de como Deus cuidou de Noé na tempestade, ele está ensinando que a família pode confiar nas eternas promessas celestes mesmo quando o tempo lá fora estiver difícil.`;
  } else if (titleLower.includes("deus") || titleLower.includes("pai") || titleLower.includes("teontologia")) {
    domainIntro = `Explicando de um jeito muito fácil e compreensível, ${title} nos ajuda a olhar para Deus não como um juiz bravo com um cajado na mão, mas como um Pai extremamente amoroso que nos criou do pó. Pense na relação de um bebê com seus pais: ele não entende de matemática, mas sabe que se estiver com medo ou com fome, o abraço quente de seu pai é o lugar mais seguro do mundo.`;
    domainExample = `Imagine, por exemplo, um artesão muito talentoso moldando um vaso de barro precioso em sua mesa. Ele cuida de cada detalhe da argila úmida com paciência, sabendo exatamente o formato definitivo que o vaso deve ter para enfeitar a casa. Deus age assim com as nossas vidas, consertando as nossas imperfeições com muito amor toda vez que as coisas parecem dar errado na rotina cotidiana.`;
    domainBible = `A Bíblia nos ensina que Deus é eterno, ou seja, Ele já existia antes das estrelas brilharem e continuará existindo para sempre. Mesmo sendo tão gigantesco e poderoso para controlar as marés e o vento, Ele escolhe escutar a oração silenciosa de uma criança em seu quarto. Ele conhece cada pensamento nosso e quer participar da nossa história diária com bastante proximidade.`;
    domainFamily = `Em família, reconhecer a soberania e o cuidado do Pai celestial é demonstrar gratidão pelas coisas pequenas que recebemos todos os dias. Por exemplo, antes de comer o almoço simples de arroz e feijão, dar as mãos na mesa e agradecer juntos pelo sustento e pela saúde afasta as reclamações e enche a nossa casa com uma atmosfera de felicidade e harmonia verdadeira.`;
  } else if (titleLower.includes("jesus") || titleLower.includes("cristo") || titleLower.includes("cristologia")) {
    domainIntro = `Pensando de forma muito prática, ${title} é sobre Jesus Cristo, que escolheu deixar a glória do céu para se tornar um homem simples como nós. Imagine o dono de uma grande empresa que resolve vestir a roupa de operário e trabalhar no chão da fábrica só para entender de verdade o cansaço e o suor de seus funcionários; Jesus fez exatamente isso ao caminhar entre nós para curar as dores do povo.`;
    domainExample = `Por exemplo, pense em uma ponte bem forte e resistente de concreto que une duas partes de uma cidade separadas por um abismo perigoso e fundo. Sem essa ponte, os moradores de um lado nunca conseguiriam visitar seus parentes do outro lado sem sofrer acidentes. Jesus é essa ponte perfeita e gratuita que nos liga novamente a Deus, limpando nossa culpa eterna de uma vez por todas.`;
    domainBible = `Os evangelhos na Bíblia contam que Jesus comia com os pecadores mais desprezados da sociedade de Sua época, estendia a mão para curar os cegos e consolava as mulheres que choravam com carinho. Ele não exigia riqueza ou títulos importantes para dar a Salvação. Ele pedia apenas confiança real, mostrando que o amor prático de Deus é voltado para os que se sentem cansados e desamparados.`;
    domainFamily = `Dentro do nosso lar, seguir a Jesus significa lavar os pés uns dos outros de forma simbólica através da nossa paciência diária. Por exemplo, quando o marido escolhe não responder com grosseria uma palavra ríspida da esposa, ou quando a esposa prepara um café quente para o marido cansado que chega do trabalho, ambos estão revelando o caráter bondoso de Cristo na cozinha de casa.`;
  } else if (titleLower.includes("espírito") || titleLower.includes("pneumatologia")) {
    domainIntro = `Para compreender sem mistérios, falar de ${title} é falar do Espírito Santo, que é como o vento suave que sentimos no rosto no final de tarde. Você não consegue segurar o vento com as mãos nem vê-lo com os olhos físicos, mas consegue ver as folhas das árvores balançando e sentir o frescor na pele. O Espírito Santo age assim, transformando o nosso coração de forma silenciosa e invisível.`;
    domainExample = `Imagine uma lanterna que está sem as pilhas dentro dela; por mais bonita e cara que ela seja, ela não consegue clarear o caminho escuro no meio da floresta à noite. O Espírito de Deus é a energia viva que entra em nós, acendendo a luz da nossa fé para que possamos tomar decisões corretas e abençoar as pessoas que nos cercam com amor verdadeiro.`;
    domainBible = `A Palavra diz que o Espírito Santo é o nosso Consolador maravilhoso enviado por Deus para habitar dentro de nós. Ele nos ajuda a orar quando estamos cansados demais e não sabemos quais palavras dizer, traduzindo os nossos suspiros de dor em petições aceitáveis ao Pai. Ele também nos dá força para dizer "não" aos pensamentos ruins e focar no que é correto.`;
    domainFamily = `Na nossa convivência familiar, a presença do Espírito se manifesta através da paciência e da união. Por exemplo, quando há um desentendimento sobre as contas do mês ou sobre a educação das crianças, e a família decide parar de gritar para fazer uma oração humilde de mãos dadas, o Espírito Santo traz aquela paz sobrenatural que acalma os ânimos de todos instantaneamente.`;
  } else if (titleLower.includes("salvação") || titleLower.includes("graça") || titleLower.includes("soteriologia")) {
    domainIntro = `Em palavras muito simples e curtas, ${title} significa ganhar um presente extremamente valioso e caro que nós nunca teríamos dinheiro para comprar ou pagar. Imagine que você cometeu uma grande dívida no comércio por acidente e não tem como pagar ao gerente; de repente, um amigo muito rico que você ama vai ao caixa e paga toda a sua conta, rasgando o papel da dívida com um abraço.`;
    domainExample = `Considere o exemplo de um navegador no mar que cai do seu pequeno barco no meio de uma onda gigante à noite e não sabe nadar na água gelada. Ele não consegue salvar a si mesmo apenas batendo os braços com desespero. Ele precisa que um marinheiro estenda uma corda de salvamento forte e o puxe para dentro do barco seguro; a salvação de Deus é essa corda estendida de graça para nós.`;
    domainBible = `As Escrituras afirmam claramente que somos salvos pela Graça, através da fé, e isso é um dom gratuito de Deus, não vindo de nossas obras para que ninguém fique orgulhoso. Isso nos traz um alívio enorme, pois mostra que o Criador nos aceita porque Ele é bom e misericordioso, e não porque nós somos perfeitos ou livres de qualquer tipo de falhas cotidianas.`;
    domainFamily = `Viver essa graça em âmbito doméstico é ser generoso com os erros que os nossos parentes cometem no dia a dia. Por exemplo, quando um copo de suco é derramado sem querer no tapete limpo da sala, em vez de brigar alto com impaciência, escolher sorrir e dizer "tudo bem, vamos limpar juntos" é um exemplo lindo de como perdoamos porque fomos perdoados primeiro pelo Pai celestial.`;
  } else {
    // Default fallback domains (Estudos, Histórias, Lugares, Curso)
    domainIntro = `Para entender de forma muito simples, ${title} é como uma semente boa plantada na nossa vida cotidiana. Quando cuidamos dela todos os dias com atenção e carinho, ela cresce saudável e dá frutos excelentes para todos ao redor. Por exemplo, pense em uma planta pequena na janela que recebe sol e água pura; aos poucos ela cresce e traz um colorido todo especial ao ambiente da casa.`;
    domainExample = `No nosso dia de trabalho ou estudo, isso se aplica quando realizamos as tarefas com dedicação sincera. Pense em uma cozinheira simples que prepara uma refeição quentinha com muito carinho para seus clientes no restaurante da esquina. Esse capricho e atenção demonstram como podemos aplicar o amor cristão de forma concreta e sem complicação em qualquer profissão ou lugar.`;
    domainBible = `A Bíblia Sagrada nos mostra de ponta a ponta que o Criador ensina Seus filhos com muita delicadeza através das situações mais corriqueiras da vida. Vemos nas histórias bíblicas que Deus prefere a simplicidade de coração ao invés de conhecimentos difíceis ou termos muito teológicos. Um coração sincero e obediente vale muito mais diante Dele do que qualquer orgulho acadêmico.`;
    domainFamily = `Dentro da nossa própria casa, com a nossa família, isso se traduz em atos contínuos de respeito mútuo. Por exemplo, quando um filho jovem toma iniciativa de limpar a mesa do jantar espontaneamente ou ouvir um conselho de seus pais com toda a atenção e carinho, ele está praticando na prática esse ensinamento e trazendo muita alegria ao lar de modo direto.`;
  }

  // Common Paragraphs to ensure exact paragraph structural targets in basic language
  const generatedParas: string[] = [
    domainIntro,
    domainExample,
    domainBible,
    domainFamily,
    
    // Paragraph 5: O papel do hábito diário na comunhão
    `A melhor maneira de manter esse aprendizado vivo no coração é criar um costume diário de intimidade com Deus no quarto. Reserve apenas 2 minutos ao acordar, de joelhos ou sentado calmamente na cama. Respire fundo, feche os olhos e entregue todas as suas preocupações e planos à providência de Deus através de uma oração simples, antes mesmo de começar a usar o telefone celular.`,
    
    // Paragraph 6: Exemplo real de mudança de vida
    `Veja o caso do jovem chamado Mateus, que trabalha em uma oficina mecânica bastante movimentada e estuda à noite. Ele andava muito estressado e sem dormir direito por conta das pressões habituais da vida. Quando começou a praticar essa pequena pausa diária com Deus antes de ligar as máquinas de manhã, ele percebeu que sua mente ficou muito mais calma para lidar com clientes difíceis.`,
    
    // Paragraph 7: Identificando os principais obstáculos modernos
    `O grande segredo é descobrir o que está roubando o nosso foco espiritual na nossa rotina normal e barulhenta. Muitas vezes, passamos horas e horas assistindo a vídeos engraçados ou lendo fofocas na internet que não constroem nada em nós, mas nos falta tempo para meditar na Palavra ou ter um momento de silêncio para ouvir o coração. Essa distração afasta a nossa paz.`,
    
    // Paragraph 8: Analogia com a poeira na lente dos óculos
    `Pense nessa distração constante como a poeira que se acumula devagar na lente de um par de óculos na rua. Se você não limpa o vidro com frequência, começa a enxergar as coisas de forma embaçada e pode acabar tropeçando no meio de uma calçada irregular. Limpar o coração com a verdade divina é tirar a sujeira dos olhos do nosso entendimento para podermos andar seguros.`,
    
    // Paragraph 9: Lidando de forma sábia com os momentos de crise
    `Quando surgem momentos difíceis de saúde ou problemas financeiros na família, a tendência natural humana é entrar em desespero e tentar resolver as coisas na nossa força. É nessas horas que precisamos lembrar de respirar fundo e pedir conselhos para pessoas idôneas e maduras na fé, em vez de falar coisas precipitadas de que vamos nos arrepender mais tarde.`,
    
    // Paragraph 10: O exemplo do agricultor paciente no campo
    `Imagine a atitude de um agricultor de milho no interior. Ele joga as sementes na terra fofa, rega com paciência e depois espera a chuva de Deus cair no tempo certo, sabendo que não pode apressar o crescimento da planta puxando as folhas verdes para cima com as mãos. Nós também devemos confiar que Deus age no tempo determinado para abençoar a nossa família.`,
    
    // Paragraph 11: Aplicando a honestidade em todas as ações comerciais
    `Nosso testemunho cristão brilha de verdade quando escolhemos ser corretos e honestos nos pequenos negócios semanais. Por exemplo, se você vai ao mercado do bairro e o caixa lhe devolve um valor de troco incorreto maior por engano, voltar e devolver a diferença é um sermão vivo muito mais potente do que qualquer palavra falada em cima de um púlpito bem decorado.`,
    
    // Paragraph 12: A força inspiradora de pequenos gestos generosos
    `A dona de casa Maria é conhecida nos arredores porque costuma assar um bolo simples de fubá toda semana e presentear os vizinhos idosos que moram sozinhos e não recebem visitas frequentes. Esse carinho sincero abre portas no coração de todos e se torna um exemplo inesquecível de que o amor real é feito de ações doces, baratas e perfeitamente práticas.`,
    
    // Paragraph 13: Vencendo o orgulho no relacionamento com as pessoas
    `Muitas vezes, o orgulho de querermos estar sempre certos destrói amizades queridas de muitos anos. Superamos essa barreira quando escolhemos a paz em vez da discussão teológica pesada. Pedir desculpas com sinceridade quando erramos, ou escutar com calma uma opinião diferente da nossa sem julgar, é a maior prova de sabedoria que um servo de Deus pode apresentar.`,
    
    // Paragraph 14: Como cooperar com a paz dentro da comunidade local
    `Na nossa comunhão ao vivo na comunidade, cada um de nós é chamado a dividir as dificuldades dos que sofrem em silêncio. Se conhecemos alguém do nosso bairro que está passando por desemprego ou tristeza profunda, podemos doar uma cesta básica simples ou fazer uma visita rápida para orar por ele e oferecer nosso ouvido atento, demonstrando acolhimento.`,
    
    // Paragraph 15: Conclusão reconfortante e oração para praticar hoje
    `Para encerrar com esperança, focar no aprendizado permanente de ${title} nos ajuda a viver de cabeça erguida diante das tempestades normais deste mundo. Pratique essas lições de forma prática hoje mesmo no seu trabalho e com os seus vizinhos queridos. Oração básica recomendada: Querido Deus, guia meus passos na Tua palavra simples, me ensina a amar meu próximo e enche minha casa com a Tua maravilhosa paz todos os dias. Amém.`
  ];

  const finalParas: string[] = [];
  
  // Take first original paragraphs to preserve specific names, dates, key concepts
  const preserveOriginalCount = Math.min(originalParas.length, Math.floor(targetCount / 4) + 1);
  for (let i = 0; i < preserveOriginalCount; i++) {
    finalParas.push(originalParas[i]);
  }
  
  // Pad with content-relevant simplified paragraphs
  let genIndex = 0;
  while (finalParas.length < targetCount) {
    if (genIndex < generatedParas.length) {
      finalParas.push(generatedParas[genIndex]);
      genIndex++;
    } else {
      finalParas.push(
        `Buscar viver esse caminho de ${title} com toda a humildade traz frutos eternos para a nossa jornada. Por exemplo, quando decidimos dar a preferência de passagem para um pedestre idoso na rua ou ajudar alguém a carregar sacolas pesadas, estamos espalhando no mundo a verdadeira semente da justiça eterna.`
      );
    }
  }
  
  // Strictly take exactly the target count
  const slicedParas = finalParas.slice(0, targetCount);
  
  return slicedParas.join("\n\n");
}
