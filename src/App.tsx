import React, { useState, useEffect } from "react";
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Search, 
  MapPin, 
  Library, 
  Lightbulb, 
  GraduationCap, 
  Menu, 
  X, 
  User,
  History,
  ChevronLeft,
  Moon,
  Sun,
  ChevronRight,
  Home as HomeIcon,
  Users,
  Plus,
  Check,
  FileText,
  Trash2,
  Play,
  Layers,
  MessageCircle,
  Instagram,
  Youtube,
  Facebook,
  Copy,
  Database,
  Heart,
  Pencil
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { BIBLICAL_THEMES, BIBLICAL_NAMES, BIBLICAL_STORIES, THEOLOGY_TOPICS, BASIC_COURSE } from "@/src/data/biblicalData";
import AITeacher from "./components/AITeacher";
import HomensDeDeusView from "./components/HomensDeDeus";
import Community from "./components/Community";
import PWAController from "./components/PWAController";
import LivretoManager from "./components/LivretoManager";
import { getSupabaseClient, checkSupabaseConfigExists } from "./lib/supabaseClient";
import { 
  ThemeBanner, 
  NativeFeedAd, 
  InterstitialAdModal, 
  RewardedVideoAdSimulator, 
  AdMetricsPanel 
} from "./components/SimulatedAds";

// --- Components ---

function getBibleVerseForItem(item: any): { reference: string; text: string } {
  const nameLower = (item?.name || item?.title || "").toLowerCase();
  const descLower = (item?.description || item?.meaning || item?.content || "").toLowerCase();
  
  // Custom prioritized verse for Abraão (Pai de multidões) across all sections
  if (
    nameLower.includes("abrahão") || 
    nameLower.includes("abraao") || 
    descLower.includes("pai de multidões") || 
    descLower.includes("pai de multidoes")
  ) {
    return { 
      reference: "Gênesis 17:5", 
      text: "Não mais te chamarás Abrão, mas Abraão será o teu nome, pois por pai de uma multidão de nações te tenho posto." 
    };
  }

  // --- SPECIFIC PLACES / HISTÓRIAS DE LUGARES ---
  if (nameLower.includes("antioquia")) {
    return { reference: "Atos 11:26", text: "E sucedereu que em Antioquia foram os discípulos, pela primeira vez, chamados cristãos." };
  }
  if (nameLower.includes("jerusalém") || nameLower.includes("jerusalem")) {
    return { reference: "Salmos 122:6", text: "Orai pela paz de Jerusalém; prosperarão aqueles que te amam." };
  }
  if (nameLower.includes("nazaré") || nameLower.includes("nazare")) {
    return { reference: "João 1:46", text: "Disse-lhe Natanael: Pode vir alguma coisa boa de Nazaré? Disse-lhe Filipe: Vem, e vê." };
  }
  if (nameLower.includes("belém") || nameLower.includes("belem")) {
    return { reference: "Miquéias 5:2", text: "E tu, Belém Efrata... de ti me sairá o que governará em Israel." };
  }
  if (nameLower.includes("jericó") || nameLower.includes("jerico")) {
    return { reference: "Josué 6:20", text: "Gritou, pois, o povo... e as muralhas de Jericó caíram por terra." };
  }
  if (nameLower.includes("egito")) {
    return { reference: "Oséias 11:1", text: "Quando Israel era menino, eu o amei; e do Egito chamei a meu filho." };
  }
  if (nameLower.includes("babilônia") || nameLower.includes("babilonia")) {
    return { reference: "Jeremias 51:37", text: "E a Babilônia se tornará em montões de ruínas, morada de chacais, sem habitante." };
  }
  if (nameLower.includes("roma")) {
    return { reference: "Romanos 1:15", text: "Estou pronto para anunciar o evangelho também a vós que estais em Roma." };
  }
  if (nameLower.includes("éfeso") || nameLower.includes("efeso")) {
    return { reference: "Atos 19:20", text: "Assim a palavra do Senhor crescia e prevalecia com poderosa força em Éfeso." };
  }
  if (nameLower.includes("corinto")) {
    return { reference: "Atos 18:1", text: "Depois disto partiu Paulo de Atenas, e chegou a Corinto." };
  }
  if (nameLower.includes("filipos")) {
    return { reference: "Atos 16:12", text: "E dali fomos a Filipos, que é a primeira cidade desta parte da Macedônia." };
  }
  if (nameLower.includes("tessalônica") || nameLower.includes("tessalonica")) {
    return { reference: "Atos 17:1", text: "Chegaram a Tessalônica, onde havia uma sinagoga de judeus." };
  }
  if (nameLower.includes("damasco")) {
    return { reference: "Atos 9:3", text: "E, indo ele no caminho... chegando perto de Damasco, subitamente o cercou um resplendor de luz do céu." };
  }
  if (nameLower.includes("jope")) {
    return { reference: "Atos 10:5", text: "Agora, pois, envia homens a Jope, e manda chamar a Simão, que tem por sobrenome Pedro." };
  }
  if (nameLower.includes("cesaréia") || nameLower.includes("cesareia")) {
    return { reference: "Atos 10:1", text: "E havia em Cesaréia um homem por nome Cornélio, centurião da coorte chamada italiana." };
  }
  if (nameLower.includes("samaria")) {
    return { reference: "Atos 8:8", text: "E houve grande alegria naquela cidade de Samaria." };
  }
  if (nameLower.includes("sinai")) {
    return { reference: "Êxodo 19:18", text: "E todo o monte Sinai fumegava, porque o Senhor descera sobre ele em fogo." };
  }
  if (nameLower.includes("carmelo")) {
    return { reference: "1 Reis 18:19", text: "Ajunta-me todo o Israel no monte Carmelo; como também os profetas de Baal." };
  }
  if (nameLower.includes("oliveiras")) {
    return { reference: "Lucas 22:39", text: "E, saindo, foi, como costumava, para o monte das Oliveiras." };
  }
  if (nameLower.includes("gólgotas") || nameLower.includes("golgota") || nameLower.includes("caveira")) {
    return { reference: "Marcos 15:22", text: "E levaram-no ao lugar do Gólgota, que se traduz por lugar da Caveira." };
  }
  if (nameLower.includes("getsêmani") || nameLower.includes("getsemani")) {
    return { reference: "Mateus 26:36", text: "Então chegou Jesus com eles a um lugar chamado Getsêmani... Assentai-vos aqui, enquanto vou além orar." };
  }
  if (nameLower.includes("jordão") || nameLower.includes("jordao")) {
    return { reference: "Mateus 3:13", text: "Então veio Jesus da Galiléia ter com João, junto ao Jordão, para ser batizado por ele." };
  }
  if (nameLower.includes("galileia") || nameLower.includes("galiléia")) {
    return { reference: "Mateus 4:18", text: "E Jesus, andando junto ao mar da Galileia, viu dois irmãos lançando a rede ao mar." };
  }
  if (nameLower.includes("cafarnaum")) {
    return { reference: "Mateus 4:13", text: "E, deixando Nazaré, foi habitar em Cafarnaum, cidade marítima." };
  }
  if (nameLower.includes("betânia") || nameLower.includes("betania")) {
    return { reference: "João 11:18", text: "Ora Betânia distava de Jerusalém quase vinte estádios." };
  }
  if (nameLower.includes("hebrom")) {
    return { reference: "2 Samuel 2:11", text: "E foi o número dos dias que Davi reinou em Hebrom sete anos e seis meses." };
  }
  if (nameLower.includes("betel")) {
    return { reference: "Gênesis 28:19", text: "E chamou o nome daquele lugar Betel; o nome, porém, daquela cidade era Luz." };
  }
  if (nameLower.includes("siquém") || nameLower.includes("siquem")) {
    return { reference: "Gênesis 12:6", text: "E passou Abrão por aquela terra até ao lugar de Siquém, até ao carvalho de Moré." };
  }
  if (nameLower.includes("siló") || nameLower.includes("silo")) {
    return { reference: "Josué 18:1", text: "E toda a congregação dos filhos de Israel se reuniu em Siló, e ali armou a tenda da congregação." };
  }
  if (nameLower.includes("nínive") || nameLower.includes("ninive")) {
    return { reference: "Jonas 3:3", text: "E levantou-se Jonas, e foi a Nínive, segundo a palavra do Senhor." };
  }
  if (nameLower.includes("tarso")) {
    return { reference: "Atos 22:3", text: "Quanto a mim, sou judeu, nascido em Tarso da Cilícia, e nesta cidade criado." };
  }
  if (nameLower.includes("patmos")) {
    return { reference: "Apocalipse 1:9", text: "Eu, João, estive na ilha chamada Patmos, por causa da palavra de Deus e pelo testemunho de Jesus." };
  }
  if (nameLower.includes("sardes")) {
    return { reference: "Apocalipse 3:1", text: "Ao anjo da igreja em Sardes escreve: Conheço as tuas obras, que tens nome de que vives, e estás morto." };
  }
  if (nameLower.includes("esmirna")) {
    return { reference: "Apocalipse 2:8", text: "Ao anjo da igreja em Esmirna escreve: Isto diz o Primeiro e o Último, que foi morto, e reviveu." };
  }
  if (nameLower.includes("pérgamo") || nameLower.includes("pergamo")) {
    return { reference: "Apocalipse 2:12", text: "Ao anjo da igreja que está em Pérgamo escreve: Isto diz aquele que tem a espada aguda." };
  }
  if (nameLower.includes("tiatira")) {
    return { reference: "Apocalipse 2:18", text: "Ao anjo da igreja de Tiatira escreve: Isto diz o Filho de Deus..." };
  }
  if (nameLower.includes("filadélfia") || nameLower.includes("filadelfia")) {
    return { reference: "Apocalipse 3:7", text: "Ao anjo da igreja que está em Filadélfia escreve: Isto diz o que é santo, o que é verdadeiro." };
  }
  if (nameLower.includes("laodiceia") || nameLower.includes("laodicéia")) {
    return { reference: "Apocalipse 3:14", text: "Ao anjo da igreja que está em Laodiceia escreve: Isto diz o Amém, a testemunha fiel e verdadeira." };
  }
  if (nameLower.includes("sodoma")) {
    return { reference: "Gênesis 19:24", text: "Então o Senhor fez chover enxofre e fogo, do Senhor desde os céus, sobre Sodoma e sobre Gomorra." };
  }
  if (nameLower.includes("gomorra")) {
    return { reference: "Gênesis 19:24", text: "Então o Senhor fez chover enxofre e fogo, do Senhor desde os céus, sobre Sodoma e sobre Gomorra." };
  }
  if (nameLower.includes("ur dos caldeus") || nameLower.includes("ur ")) {
    return { reference: "Gênesis 15:7", text: "Disse-lhe mais: Eu sou o Senhor, que te tirei de Ur dos Caldeus, para dar-te a ti esta terra." };
  }
  if (nameLower.includes("harã") || nameLower.includes("hara")) {
    return { reference: "Gênesis 12:4", text: "E era Abrão da idade de setenta e cinco anos quando saiu de Harã." };
  }
  if (nameLower.includes("uz")) {
    return { reference: "Jó 1:1", text: "Havia um homem na terra de Uz, cujo nome era Jó; e era este homem íntegro, reto e temente a Deus." };
  }
  if (nameLower.includes("babel") || nameLower.includes("torre")) {
    return { reference: "Gênesis 11:9", text: "Por isso se chamou o seu nome Babel, porquanto ali confundiu o Senhor a linguagem de toda a terra." };
  }
  if (nameLower.includes("éden") || nameLower.includes("eden") || nameLower.includes("jardim")) {
    return { reference: "Gênesis 2:15", text: "E tomou o Senhor Deus o homem, e o pôs no jardim do Éden para o lavrar e o guardar." };
  }
  if (nameLower.includes("ararate")) {
    return { reference: "Gênesis 8:4", text: "E a arca repousou no sétimo mês, no dia dezessete do mês, sobre os montes de Ararate." };
  }
  if (nameLower.includes("nilo")) {
    return { reference: "Êxodo 7:17", text: "Eis que eu ferirei com a vara as águas que estão no rio Nilo, e elas se tornarão em sangue." };
  }
  if (nameLower.includes("vermelho")) {
    return { reference: "Êxodo 14:21", text: "Moisés estendeu a sua mão sobre o mar, e o mar tornou-se em terra seca." };
  }
  if (nameLower.includes("hermom")) {
    return { reference: "Salmos 133:3", text: "Como o orvalho de Hermom, e como o que desce sobre os montes de Sião." };
  }
  if (nameLower.includes("tabor")) {
    return { reference: "Salmos 89:12", text: "O norte e o sul tu os criaste; o Tabor e o Hermom jubilam em teu nome." };
  }

  // --- FAMOUS BIBLE CHARACTERS (DICTIONARY OF NAMES) ---
  if (nameLower.includes("moisés") || nameLower.includes("moises")) {
    return { reference: "Hebreus 11:24-25", text: "Pela fé Moisés, sendo já grande, recusou ser chamado filho da filha de Faraó, escolhendo antes ser maltratado com o povo de Deus." };
  }
  if (nameLower.includes("davi")) {
    return { reference: "Atos 13:22", text: "Achei a Davi, filho de Jessé, homem conforme o meu coração, que executará toda a minha vontade." };
  }
  if (nameLower.includes("ester")) {
    return { reference: "Ester 4:14", text: "E quem sabe se para conjuntura como esta é que foste elevada a rainha?" };
  }
  if (nameLower.includes("pedro")) {
    return { reference: "Mateus 16:18", text: "Pois também eu te digo que tu és Pedro, e sobre esta pedra edificarei a minha igreja." };
  }
  if (nameLower.includes("paulo")) {
    return { reference: "Filipenses 1:21", text: "Porque para mim o viver é Cristo, e o morrer é ganho." };
  }
  if (nameLower.includes("sara")) {
    return { reference: "Hebreus 11:11", text: "Pela fé também a mesma Sara recebeu a virtude de conceber, porquanto teve por fiel aquele que lho tinha prometido." };
  }
  if (nameLower.includes("samuel")) {
    return { reference: "1 Samuel 3:10", text: "Fala, Senhor, porque o teu servo ouve." };
  }
  if (nameLower.includes("débora") || nameLower.includes("debora")) {
    return { reference: "Juízes 5:7", text: "Cessaram as aldeias em Israel, cessaram; até que eu, Débora, me levantei, levantei-me por mãe em Israel." };
  }
  if (nameLower.includes("josué") || nameLower.includes("josue")) {
    return { reference: "Josué 1:9", text: "Não te mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo." };
  }
  if (nameLower.includes("rute")) {
    return { reference: "Rute 1:16", text: "O teu povo será o meu povo, e o teu Deus o meu Deus." };
  }
  if (nameLower.includes("elias")) {
    return { reference: "Tiago 5:17", text: "Elias era homem sujeito às mesmas paixões que nós e, orando, pediu que não chovesse, e, por três anos e seis meses, não choveu sobre a terra." };
  }
  if (nameLower.includes("isabel")) {
    return { reference: "Lucas 1:45", text: "Bem-aventurada a que creu, pois hão de cumprir-se as coisas que da parte do Senhor lhe foram ditas." };
  }
  if (nameLower.includes("daniel")) {
    return { reference: "Daniel 6:22", text: "O meu Deus enviou o seu anjo, e fechou a boca dos leões, para que não me fizessem dano." };
  }
  if (nameLower.includes("maria")) {
    return { reference: "Lucas 1:38", text: "Disse então Maria: Eis aqui a serva do Senhor; cumpra-se em mim segundo a tua palavra." };
  }
  if (nameLower.includes("noé") || nameLower.includes("noe")) {
    return { reference: "Gênesis 6:8", text: "Noé, porém, achou graça aos olhos do Senhor." };
  }
  if (nameLower.includes("isaque")) {
    return { reference: "Gênesis 26:24", text: "Não temas, porque eu sou contigo, e abençoar-te-ei, e multiplicarei a tua descendência por amor de meu servo Abraão." };
  }
  if (nameLower.includes("jacó") || nameLower.includes("jaco")) {
    return { reference: "Gênesis 32:28", text: "Não se chamará mais o teu nome Jacó, mas Israel; pois como príncipe lutaste com Deus e com os homens, e prevaleceste." };
  }
  if (nameLower.includes("josé") || nameLower.includes("jose")) {
    return { reference: "Gênesis 50:20", text: "Vós bem intentastes mal contra mim; porém Deus o tornou em bem, para fazer como se vê neste dia, para conservar muita gente com vida." };
  }
  if (nameLower.includes("gideão") || nameLower.includes("gideao")) {
    return { reference: "Juízes 6:14", text: "Vai nessa tua força, e salvarás a Israel da mão dos midianitas; porventura não te enviei eu?" };
  }
  if (nameLower.includes("sansão") || nameLower.includes("sansao")) {
    return { reference: "Juízes 16:28", text: "Senhor Deus, peço-te que te lembres de mim, e esforça-me agora só esta vez, ó Deus, para que de uma vez me vingue dos filisteus." };
  }
  if (nameLower.includes("ana")) {
    return { reference: "1 Samuel 1:27", text: "Por este menino orava eu; e o Senhor atendeu à minha petição, que eu lhe tinha feito." };
  }
  if (nameLower.includes("miriam") || nameLower.includes("miriã")) {
    return { reference: "Êxodo 15:20", text: "E Miriã, a profetisa, tomou o tamboril na sua mão, e todas as mulheres saíram atrás dela com tamboris." };
  }
  if (nameLower.includes("salomão") || nameLower.includes("salomao")) {
    return { reference: "1 Reis 3:9", text: "Dá, pois, ao teu servo um coração entendido para julgar a teu povo, para que prudentemente discirna entre o bem e o mal." };
  }
  if (nameLower.includes("isaías") || nameLower.includes("isaias")) {
    return { reference: "Isaías 6:8", text: "Depois disto ouvi a voz do Senhor, que dizia: A quem enviarei? Então disse eu: Eis-me aqui, envia-me a mim." };
  }
  if (nameLower.includes("jeremias")) {
    return { reference: "Jeremias 1:5", text: "Antes que te formasse no ventre te conheci, e antes que saísses da madre te santifiquei; às nações te dei por profeta." };
  }
  if (nameLower.includes("ezequiel")) {
    return { reference: "Ezequiel 36:26", text: "E dar-vos-ei um coração novo, e porei dentro de vós um espírito novo." };
  }
  if (nameLower.includes("oséias") || nameLower.includes("oseias")) {
    return { reference: "Oséias 6:3", text: "Conheçamos, e prossigamos em conhecer ao Senhor." };
  }
  if (nameLower.includes("amós") || nameLower.includes("amos")) {
    return { reference: "Amós 5:24", text: "Corra, porém, o juízo como as águas, e a justiça como o ribeiro impetuoso." };
  }
  if (nameLower.includes("miquéias") || nameLower.includes("miqueias")) {
    return { reference: "Miquéias 6:8", text: "Ele te declarou, ó homem, o que é bom; senão que Practices a justiça, e ames a beneficência, e andes humildemente com o teu Deus." };
  }
  if (nameLower.includes("joão") || nameLower.includes("joao")) {
    return { reference: "João 1:1", text: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus." };
  }
  if (nameLower.includes("tiago")) {
    return { reference: "Tiago 1:22", text: "E sede cumpridores da palavra, e não somente ouvintes, enganando-vos a vós mesmos." };
  }
  if (nameLower.includes("mateus")) {
    return { reference: "Mateus 9:9", text: "Viu assentado na alfândega um homem, chamado Mateus, e disse-lhe: Segue-me. E ele, levantando-se, o seguiu." };
  }
  if (nameLower.includes("lucas")) {
    return { reference: "Colossenses 4:14", text: "Saúda-vos Lucas, o médico amado, e Demas." };
  }
  if (nameLower.includes("marcos")) {
    return { reference: "2 Timóteo 4:11", text: "Toma a Marcos, e traze-o contigo, porque me é muito útil para o ministério." };
  }
  if (nameLower.includes("estêvão") || nameLower.includes("estevao")) {
    return { reference: "Atos 7:59", text: "E apedrejavam a Estêvão que em invocação dizia: Senhor Jesus, recebe o meu espírito." };
  }
  if (nameLower.includes("filipe")) {
    return { reference: "Atos 8:35", text: "Então Filipe, abrindo a sua boca, e começando nesta Escritura, lhe anunciou a Jesus." };
  }
  if (nameLower.includes("tomé") || nameLower.includes("tome")) {
    return { reference: "João 20:29", text: "Disse-lhe Jesus: Porque me viste, Tomé, creste; bem-aventurados os que não viram e creram." };
  }
  if (nameLower.includes("barnabé") || nameLower.includes("barnabe")) {
    return { reference: "Atos 11:24", text: "Porque era homem de bem, e cheio do Espírito Santo e de fé. E muita gente se uniu ao Senhor." };
  }
  if (nameLower.includes("timóteo") || nameLower.includes("timoteo")) {
    return { reference: "1 Timóteo 4:12", text: "Ninguém despreze a tua mocidade; mas sê o exemplo dos fiéis, na palavra, no trato, no amor, no espírito." };
  }
  if (nameLower.includes("tito")) {
    return { reference: "Tito 1:4", text: "A Tito, meu verdadeiro filho, segundo a fé comum: Graça, misericórdia e paz da parte de Deus Pai." };
  }
  if (nameLower.includes("silas")) {
    return { reference: "Atos 16:25", text: "E, perto da meia-noite, Paulo e Silas oravam e cantavam hinos a Deus, e os outros presos os escutavam." };
  }
  if (nameLower.includes("lídia") || nameLower.includes("lidia")) {
    return { reference: "Atos 16:14", text: "Lídia, vendedora de púrpura... o Senhor lhe abriu o coração para que estivesse atenta ao que Paulo dizia." };
  }
  if (nameLower.includes("priscila")) {
    return { reference: "Atos 18:26", text: "Quando o ouviram Priscila e Áquila, o levaram consigo e com mais precisão lhe declararam o caminho de Deus." };
  }
  if (nameLower.includes("áquila") || nameLower.includes("aquila")) {
    return { reference: "Romanos 16:3", text: "Saudai a Priscila e a Áquila, meus cooperadores em Cristo Jesus." };
  }
  if (nameLower.includes("apolo")) {
    return { reference: "Atos 18:24", text: "Apolo, natural de Alexandria, homem eloquente e poderoso nas Escrituras." };
  }
  if (nameLower.includes("febe")) {
    return { reference: "Romanos 16:1", text: "Recomendo-vos, pois, Febe, nossa irmã, a qual serve na igreja que está em Cencreia." };
  }
  if (nameLower.includes("epafras")) {
    return { reference: "Colossenses 1:7", text: "Como ao diante aprendestes de Epafras, nosso amado conservo, que para vós é um fiel ministro de Cristo." };
  }
  if (nameLower.includes("onésimo") || nameLower.includes("onesimo")) {
    return { reference: "Filemon 1:10", text: "Peço-te por meu filho Onésimo, que gerei nas minhas prisões." };
  }
  if (nameLower.includes("eutico")) {
    return { reference: "Atos 20:9", text: "E, estando um jovem, chamado Eutico, assentado numa janela, caindo num sono profundo... foi levantado morto." };
  }
  if (nameLower.includes("matias")) {
    return { reference: "Atos 1:26", text: "E por voto comum foi contado com os onze apóstolos." };
  }
  if (nameLower.includes("cornélio") || nameLower.includes("cornelio")) {
    return { reference: "Atos 10:2", text: "Homem piedoso e temente a Deus, o qual fazia muitas esmolas ao povo, e de contínuo orava a Deus." };
  }
  if (nameLower.includes("dorcas")) {
    return { reference: "Atos 9:36", text: "Uma discípula chamada Tabita, que se traduz por Dorcas. Esta estava cheia de boas obras e esmolas." };
  }
  if (nameLower.includes("eunice")) {
    return { reference: "2 Timóteo 1:5", text: "Trazendo à memória a fé não fingida... que habitou primeiro em tua mãe Eunice." };
  }
  if (nameLower.includes("lóide") || nameLower.includes("loide")) {
    return { reference: "2 Timóteo 1:5", text: "Trazendo à memória a fé não fingida... que habitou primeiro em tua avó Lóide." };
  }
  if (nameLower.includes("gaio")) {
    return { reference: "3 João 1:1", text: "O ancião ao amado Gaio, a quem no amor da verdade eu amo." };
  }
  if (nameLower.includes("demétrio") || nameLower.includes("demetrio")) {
    return { reference: "3 João 1:12", text: "Todos dão testemunho de Demétrio, até a mesma verdade; e também nós testemunhamos." };
  }
  if (nameLower.includes("natã") || nameLower.includes("natan")) {
    return { reference: "2 Samuel 12:7", text: "Então disse Natã a Davi: Tu és este homem." };
  }
  if (nameLower.includes("bate-seba") || nameLower.includes("bate seba")) {
    return { reference: "2 Samuel 11:3", text: "Disseram: Porventura não é esta Bate-Seba, filha de Eliã, mulher de Urias, o heteu?" };
  }
  if (nameLower.includes("absalão") || nameLower.includes("absalao")) {
    return { reference: "2 Samuel 18:33", text: "O rei chorava e dizia: Filho meu Absalão, filho meu, quem me dera que eu morrera por ti!" };
  }
  if (nameLower.includes("jônatas") || nameLower.includes("jonathan") || nameLower.includes("jonatas")) {
    return { reference: "1 Samuel 18:1", text: "A alma de Jônatas se ligou com a alma de Davi; e Jônatas o amou, como à sua própria alma." };
  }
  if (nameLower.includes("saul")) {
    return { reference: "1 Samuel 10:11", text: "Que é o que sucedeu ao filho de Quis? Está também Saul entre os profetas?" };
  }
  if (nameLower.includes("boaz")) {
    return { reference: "Rute 2:1", text: "E tinha Noemi um parente de seu marido... e o seu nome era Boaz." };
  }
  if (nameLower.includes("obed") || nameLower.includes("obede")) {
    return { reference: "Rute 4:17", text: "E chamaram o seu nome Obede. Este é o pai de Jessé, pai de Davi." };
  }
  if (nameLower.includes("jessé") || nameLower.includes("jesse")) {
    return { reference: "Isaías 11:1", text: "Porque brotará um rebento do tronco de Jessé, e das suas raíces um renovo frutificará." };
  }
  if (nameLower.includes("rebeca")) {
    return { reference: "Gênesis 24:67", text: "E tomou a Rebeca, e foi-lhe por mulher, e amou-a." };
  }
  if (nameLower.includes("raquel")) {
    return { reference: "Gênesis 29:18", text: "E Jacó amava a Raquel, e disse: Sete anos te servirei por Raquel, tua filha menor." };
  }
  if (nameLower.includes("lia")) {
    return { reference: "Gênesis 29:17", text: "Lia, porém, se parecia com Raquel, mas Raquel era de formoso semblante." };
  }
  if (nameLower.includes("esaú") || nameLower.includes("esau")) {
    return { reference: "Gênesis 25:27", text: "Andando o tempo, Esaú foi homem perito na caça, homem do campo." };
  }
  if (nameLower.includes("labão") || nameLower.includes("labao")) {
    return { reference: "Gênesis 29:13", text: "Ouvindo Labão as novas de Jacó, filho de sua irmã, correu-lhe ao encontro." };
  }
  if (nameLower.includes("efraim")) {
    return { reference: "Gênesis 41:52", text: "E o nome do segundo chamou Efraim, porque disse: Deus me fez crescer." };
  }
  if (nameLower.includes("manassés") || nameLower.includes("manasses")) {
    return { reference: "Gênesis 41:51", text: "E chamou José ao primogênito de Manassés, porque disse: Deus me fez esquecer." };
  }
  if (nameLower.includes("benjamim")) {
    return { reference: "Gênesis 35:18", text: "E acontecendo que saindo-lhe a alma, o seu pai chamou-lhe Benjamim." };
  }
  if (nameLower.includes("levi")) {
    return { reference: "Gênesis 29:34", text: "Esta vez se unirá meu marido a mim, porque três filhos lhe tenho dado; por isso o chamou Levi." };
  }
  if (nameLower.includes("judá") || nameLower.includes("juda")) {
    return { reference: "Gênesis 49:10", text: "O cetro não se arredará de Judá, nem o legislador dentre os seus pés." };
  }
  if (nameLower.includes("rúben") || nameLower.includes("ruben")) {
    return { reference: "Gênesis 29:32", text: "Deu à luz um filho, e chamou o seu nome Rúben, porque disse: O Senhor atendeu à minha aflição." };
  }
  if (nameLower.includes("dã") || nameLower.includes("da")) {
    return { reference: "Gênesis 49:16", text: "Dã julgará o seu povo, como uma das tribos de Israel." };
  }
  if (nameLower.includes("naftali")) {
    return { reference: "Gênesis 49:21", text: "Naftali é uma serva solta; ele dá palavras formosas." };
  }
  if (nameLower.includes("gade")) {
    return { reference: "Gênesis 49:19", text: "Quanto a Gade, uma tropa o acometerá; mas ele a acometerá no fim." };
  }
  if (nameLower.includes("aser")) {
    return { reference: "Gênesis 49:20", text: "De Aser, o seu pão será abundante, e ele dará delícias reais." };
  }
  if (nameLower.includes("issacar")) {
    return { reference: "Gênesis 49:14", text: "Issacar é jumento de fortes ossos, deitado entre dois fardos." };
  }
  if (nameLower.includes("zebulom") || nameLower.includes("zebulun")) {
    return { reference: "Gênesis 49:13", text: "Zebulom habitará no porto dos mares, e será como porto dos navios." };
  }
  if (nameLower.includes("fineias") || nameLower.includes("fineas")) {
    return { reference: "Salmos 106:30", text: "Então se levantou Fineias, e executou o juízo, e cessou aquela peste." };
  }
  if (nameLower.includes("eleazar")) {
    return { reference: "Josué 24:33", text: "Faleceu também Eleazar, filho de Arão, e o sepultaram no outeiro de Fineias." };
  }
  if (nameLower.includes("arão") || nameLower.includes("arao")) {
    return { reference: "Hebreus 5:4", text: "E ninguém toma para si esta honra, senão o que é chamado por Deus, como Arão." };
  }
  if (nameLower.includes("calebe")) {
    return { reference: "Josué 14:14", text: "Hebrom ficou sendo de Calebe em herança... porquanto perseverara em seguir ao Senhor." };
  }
  if (nameLower.includes("josias")) {
    return { reference: "2 Reis 23:25", text: "Não houve antes dele rei semelhante, que se convertesse ao Senhor com todo o seu coração." };
  }
  if (nameLower.includes("ezequias")) {
    return { reference: "2 Reis 18:5", text: "No Senhor Deus de Israel confiou, de maneira que depois dele não houve seu semelhante." };
  }
  if (nameLower.includes("neemias")) {
    return { reference: "Neemias 2:17", text: "Vinde, e edifiquemos o muro de Jerusalém, e não sejamos mais um opróbrio." };
  }
  if (nameLower.includes("esdras")) {
    return { reference: "Esdras 7:10", text: "Esdras tinha preparado o seu coração para buscar a lei do Senhor e para a cumprir." };
  }
  if (nameLower.includes("zorobabel")) {
    return { reference: "Zacarias 4:6", text: "Não por força nem por violência, mas sim pelo meu Espírito, diz o Senhor dos Exércitos." };
  }
  if (nameLower.includes("zacarias")) {
    return { reference: "Lucas 1:13", text: "Mas o anjo lhe disse: Zacarias, não temas, porque a tua oração foi ouvida." };
  }
  if (nameLower.includes("malaquias")) {
    return { reference: "Malaquias 3:1", text: "Eis que eu envio o meu mensageiro, que preparará o caminho diante de mim." };
  }
  if (nameLower.includes("habacuque")) {
    return { reference: "Habacuque 2:4", text: "Mas o justo pela sua fé viverá." };
  }
  if (nameLower.includes("sofonias")) {
    return { reference: "Sofonias 3:17", text: "O Senhor teu Deus está no meio de ti, poderoso para salvar; ele se deleitará em ti." };
  }
  if (nameLower.includes("naum")) {
    return { reference: "Naum 1:7", text: "O Senhor é bom, uma fortaleza no dia da angústia, e conhece os que confiam nele." };
  }
  if (nameLower.includes("obadias")) {
    return { reference: "Obadias 1:21", text: "E subirão salvadores ao monte Sião, para julgarem o monte de Esaú; e o reino será do Senhor." };
  }
  if (nameLower.includes("jonas")) {
    return { reference: "Mateus 12:40", text: "Como Jonas esteve três dias e três noites no ventre da baleia, assim estará o Filho do homem no seio da terra." };
  }
  if (nameLower.includes("joel")) {
    return { reference: "Joel 2:28", text: "E há de ser que... derramarei o meu Espírito sobre toda a carne; e vossos filhos profetizarão." };
  }

  // --- ACADEMIC / SPIRITUAL THEMES & THEOLOGY STUDIES ---
  if (nameLower.includes("fé") || nameLower.includes("fe ")) {
    return { reference: "Hebreus 11:1", text: "Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem." };
  }
  if (nameLower.includes("amor")) {
    return { reference: "1 Coríntios 13:13", text: "Agora, pois, permanecem a fé, a esperança e o amor, estes três, mas o maior destes é o amor." };
  }
  if (nameLower.includes("oração") || nameLower.includes("oracao")) {
    return { reference: "1 Tessalonicenses 5:17", text: "Orai sem cessar." };
  }
  if (nameLower.includes("perdão") || nameLower.includes("perdao")) {
    return { reference: "Colossenses 3:13", text: "Perdoando-vos uns aos outros, se alguém tiver queixa contra outro; assim como Cristo vos perdoou." };
  }
  if (nameLower.includes("graça") || nameLower.includes("graca")) {
    return { reference: "Efésios 2:8", text: "Porque pela graça sois salvos, mediante a fé; e isto não vem de vós, é dom de Deus." };
  }
  if (nameLower.includes("salvação") || nameLower.includes("salvacao") || nameLower.includes("soteriologia")) {
    return { reference: "Atos 4:12", text: "E em nenhum outro há salvação, porque também debaixo do céu nenhum outro nome há, dado entre os homens." };
  }
  if (nameLower.includes("espírito santo") || nameLower.includes("espirito santo") || nameLower.includes("pneumatologia")) {
    return { reference: "João 14:26", text: "Mas aquele Consolador, o Espírito Santo, esse vos ensinará todas as coisas, e vos fará lembrar." };
  }
  if (nameLower.includes("santidade") || nameLower.includes("santificação") || nameLower.includes("santificacao")) {
    return { reference: "1 Pedro 1:16", text: "Porquanto está escrito: Sede santos, porque eu sou santo." };
  }
  if (nameLower.includes("adoração") || nameLower.includes("adoracao") || nameLower.includes("louvor")) {
    return { reference: "João 4:24", text: "Deus é Espírito, e importa que os que o adoram o adorem em espírito e em verdade." };
  }
  if (nameLower.includes("paciência") || nameLower.includes("paciencia")) {
    return { reference: "Tiago 1:4", text: "Tenha, porém, a paciência a sua obra perfeita, para que sejais perfeitos e completos." };
  }
  if (nameLower.includes("esperança") || nameLower.includes("esperanca")) {
    return { reference: "Romanos 15:13", text: "Ora o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo." };
  }
  if (nameLower.includes("justiça") || nameLower.includes("justica")) {
    return { reference: "Mateus 6:33", text: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas." };
  }
  if (nameLower.includes("misericórdia") || nameLower.includes("misericordia")) {
    return { reference: "Lamentações 3:22-23", text: "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas compaixões não têm fim." };
  }
  if (nameLower.includes("sabedoria")) {
    return { reference: "Tiago 1:5", text: "E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente." };
  }
  if (nameLower.includes("família") || nameLower.includes("familia") || nameLower.includes("casamento")) {
    return { reference: "Josué 24:15", text: "Porém eu e a minha casa serviremos ao Senhor." };
  }
  if (nameLower.includes("trabalho") || nameLower.includes("ética") || nameLower.includes("etica")) {
    return { reference: "Colossenses 3:23", text: "E tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens." };
  }
  if (nameLower.includes("mordomia")) {
    return { reference: "1 Pedro 4:10", text: "Cada um administre aos outros o dom como o recebeu, como bons despenseiros da multiforme graça de Deus." };
  }
  if (nameLower.includes("vinda") || nameLower.includes("escatologia") || nameLower.includes("anticristo") || nameLower.includes("tribulação") || nameLower.includes("milênio")) {
    return { reference: "Apocalipse 22:20", text: "Certamente cedo venho. Amém. Ora vem, Senhor Jesus." };
  }
  if (nameLower.includes("identidade")) {
    return { reference: "Gálatas 2:20", text: "Já estou crucificado com Cristo; e vivo, não mais eu, mas Cristo vive em mim." };
  }
  if (nameLower.includes("igreja") || nameLower.includes("comunidade") || nameLower.includes("comunhão")) {
    return { reference: "Mateus 16:18", text: "Pois também eu te digo que tu és Pedro, e sobre esta pedra edificarei a minha igreja." };
  }
  if (nameLower.includes("batismo")) {
    return { reference: "Romanos 6:4", text: "Fomos, pois, sepultados com ele pelo batismo na morte, para que... assim andemos nós também em novidade de vida." };
  }
  if (nameLower.includes("ceia")) {
    return { reference: "1 Coríntios 11:26", text: "Porque todas as vezes que comerdes este pão e beberdes este cálice anunciais a morte do Senhor, até que venha." };
  }
  if (nameLower.includes("missões") || nameLower.includes("missoes") || nameLower.includes("missionário") || nameLower.includes("evangelismo")) {
    return { reference: "Marcos 16:15", text: "E disse-lhes: Ide por todo o mundo, pregai o evangelho a toda criatura." };
  }
  if (nameLower.includes("humildade") || nameLower.includes("mansidão") || nameLower.includes("mansidao")) {
    return { reference: "Filipenses 2:3", text: "Nada façais por contenda ou por vanglória, mas por humildade; cada um considere os outros superiores a si mesmo." };
  }
  if (nameLower.includes("generosidade") || nameLower.includes("dízimo") || nameLower.includes("dizimo") || nameLower.includes("ofertas") || nameLower.includes("contribua")) {
    return { reference: "2 Coríntios 9:7", text: "Cada um contribua segundo propôs no seu coração... porque Deus ama ao que dá com alegria." };
  }
  if (nameLower.includes("obediência") || nameLower.includes("obediencia")) {
    return { reference: "João 14:15", text: "Se me amais, guardareis os meus mandamentos." };
  }
  if (nameLower.includes("arrependimento")) {
    return { reference: "Atos 3:19", text: "Arrependei-vos, pois, e convertei-vos, para que sejam apagados os vossos pecados." };
  }
  if (nameLower.includes("tentação") || nameLower.includes("tentacao") || nameLower.includes("sofrimento")) {
    return { reference: "1 Coríntios 10:13", text: "Fiel é Deus, que não vos deixará tentar acima do que podeis." };
  }
  if (nameLower.includes("alegria") || nameLower.includes("paz")) {
    return { reference: "João 14:27", text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá." };
  }
  if (nameLower.includes("fidelidade") || nameLower.includes("compromisso")) {
    return { reference: "Apocalipse 2:10", text: "Sê fiel até à morte, e dar-te-ei a coroa da vida." };
  }
  if (nameLower.includes("armadura")) {
    return { reference: "Efésios 6:11", text: "Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo." };
  }
  if (nameLower.includes("fruto")) {
    return { reference: "Gálatas 5:22-23", text: "Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança." };
  }
  if (nameLower.includes("nova criatura") || nameLower.includes("nascimento") || nameLower.includes("novo nascimento")) {
    return { reference: "2 Coríntios 5:17", text: "Assim que, se alguém está em Cristo, nova criatura é; as coisas antigas já passaram." };
  }
  if (nameLower.includes("reino")) {
    return { reference: "Romanos 14:17", text: "Porque o reino de Deus não é comida nem bebida, mas justiça, e paz, e alegria no Espírito Santo." };
  }
  if (nameLower.includes("aliança") || nameLower.includes("alianca")) {
    return { reference: "Gênesis 9:13", text: "O meu arco tenho posto na nuvem; este será por sinal da aliança entre mim e a terra." };
  }
  if (nameLower.includes("lei")) {
    return { reference: "João 1:17", text: "Porque a lei foi dada por Moisés; a graça e a verdade vieram por Jesus Cristo." };
  }
  if (nameLower.includes("propósito") || nameLower.includes("proposito")) {
    return { reference: "Romanos 8:28", text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito." };
  }
  if (nameLower.includes("destino") || nameLower.includes("alma")) {
    return { reference: "Hebreus 9:27", text: "E, como aos homens está ordenado morrerem uma vez, vindo depois disso o juízo." };
  }
  if (nameLower.includes("criação") || nameLower.includes("criacao") || nameLower.includes("providência") || nameLower.includes("providencia") || nameLower.includes("soberania")) {
    return { reference: "Romanos 11:36", text: "Porque dele e por ele, e para ele, são todas as coisas; glória, pois, a ele eternamente. Amém." };
  }
  if (nameLower.includes("glória") || nameLower.includes("gloria")) {
    return { reference: "Salmos 19:1", text: "Os céus declaram a glória de Deus e o firmamento anuncia a obra das suas mãos." };
  }
  if (nameLower.includes("profecia") || nameLower.includes("sonhos") || nameLower.includes("visões") || nameLower.includes("revelação")) {
    return { reference: "2 Pedro 1:21", text: "Porque a profecia nunca foi produzida por vontade de homem algum, mas os homens de Deus falaram movidos pelo Espírito Santo." };
  }
  if (nameLower.includes("espiritual") || nameLower.includes("sobrenatural") || nameLower.includes("anjos") || nameLower.includes("demônios") || nameLower.includes("batalha")) {
    return { reference: "Efésios 6:12", text: "Porque não temos que lutar contra a carne e o sangue, mas, sim, contra os principados, contra as potestades." };
  }
  if (nameLower.includes("sexo") || nameLower.includes("sexual") || nameLower.includes("caráter") || nameLower.includes("líder") || nameLower.includes("lider")) {
    return { reference: "Hebreus 13:4", text: "Venerado seja entre todos o matrimônio e o leito sem mácula." };
  }
  if (nameLower.includes("inferno") || nameLower.includes("juízo") || nameLower.includes("juizo")) {
    return { reference: "Mateus 10:28", text: "Temei antes aquele que pode fazer perecer no inferno a alma e o corpo." };
  }
  if (nameLower.includes("cruz") || nameLower.includes("redenção") || nameLower.includes("expiação") || nameLower.includes("redencao")) {
    return { reference: "Gálatas 6:14", text: "Mas longe esteja de mim gloriar-me, a não ser na cruz de nosso Senhor Jesus Cristo." };
  }
  if (nameLower.includes("céus") || nameLower.includes("ceus") || nameLower.includes("terra")) {
    return { reference: "2 Coríntios 12:2", text: "Conheço um homem em Cristo que há catorze anos foi arrebatado ao terceiro céu." };
  }
  if (nameLower.includes("jejum") || nameLower.includes("sacrifício") || nameLower.includes("sacrificio")) {
    return { reference: "Mateus 6:17-18", text: "Tu, porém, quando jejuares, unge a tua cabeça, e lava o seu rosto, para não pareceres aos homens que jejuas." };
  }
  if (nameLower.includes("deus") || nameLower.includes("teontologia")) {
    return { reference: "Isaías 40:28", text: "Não sabes, não ouviste que o eterno Deus, o Senhor, o Criador dos fins da terra, nem se cansa nem se fatiga?" };
  }
  if (nameLower.includes("bíblia") || nameLower.includes("biblia") || nameLower.includes("escrituras") || nameLower.includes("bibliologia")) {
    return { reference: "Salmos 119:105", text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." };
  }
  if (nameLower.includes("jesus") || nameLower.includes("cristo") || nameLower.includes("cristologia")) {
    return { reference: "Atos 4:12", text: "E em nenhum outro há salvação, porque também debaixo do céu nenhum outro nome há, dado entre os homens." };
  }
  if (nameLower.includes("medo")) {
    return { reference: "Salmos 56:3", text: "No dia em que eu temer, hei de confiar em ti." };
  }
  if (nameLower.includes("defesa") || nameLower.includes("apologética") || nameLower.includes("apologetica")) {
    return { reference: "1 Pedro 3:15", text: "Estando sempre preparados para responder com mansidão a qualquer que vos pedir a razão da esperança que há vós." };
  }
  if (nameLower.includes("púlpito") || nameLower.includes("pregação") || nameLower.includes("pregacao") || nameLower.includes("homilética")) {
    return { reference: "2 Timóteo 4:2", text: "Prega a palavra, insta, quer seja oportuno, quer não... exorta com toda a longanimidade." };
  }
  if (nameLower.includes("artes") || nameLower.includes("música") || nameLower.includes("musica")) {
    return { reference: "Salmos 150:6", text: "Tudo quanto tem fôlego louve ao Senhor. Louvai ao Senhor." };
  }
  if (nameLower.includes("discipulado")) {
    return { reference: "Mateus 28:19", text: "Portanto ide, fazei discípulos de todas as nações, batizando-os em nome do Pai, e do Filho, e do Espírito Santo." };
  }

  // --- ITEM FIELD BACKUP (IF DEFINED INDIVIDUALLY) ---
  if (item && item.bibleVerse) {
    const parts = item.bibleVerse.split(" - ");
    if (parts.length > 1) {
      return { reference: parts[0], text: parts.slice(1).join(" - ") };
    }
    const partsAlt = item.bibleVerse.split(" — ");
    if (partsAlt.length > 1) {
      return { reference: partsAlt[0], text: partsAlt.slice(1).join(" — ") };
    }
    return { reference: "Referência Especial", text: item.bibleVerse };
  }

  // --- GENERAL FALLBACKS ---
  const defaultVerses = [
    { reference: "João 5:39", text: "Examinais as Escrituras, porque vós cuidais ter nelas a vida eterna, e são elas mesmas que testificam de mim." },
    { reference: "Salmos 119:105", text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." },
    { reference: "Hebreus 4:12", text: "Porque a palavra de Deus é viva e eficaz, e mais penetrante do que espada alguma de dois gumes." },
    { reference: "Josué 1:8", text: "Não se aparte da tua boca o livro desta lei; antes medita nele dia e noite, para que tenhas cuidado de fazer conforme a tudo quanto nele está escrito." },
    { reference: "Mateus 24:35", text: "O céu e a terra passarão, mas as minhas palavras não hão de passar." },
  ];

  const index = (item?.name || item?.title || "Biblia").length % defaultVerses.length;
  return defaultVerses[index];
}

function StudyDetailModal({ 
  item, 
  onClose,
  onComplete,
  isCompleted
}: { 
  item: any; 
  onClose: () => void;
  onComplete?: (item: any) => void;
  isCompleted?: boolean;
}) {
  if (!item) return null;

  const [isInBooklet, setIsInBooklet] = useState(false);

  useEffect(() => {
    const checkState = () => {
      try {
        const saved = localStorage.getItem("escola_da_fe_booklet");
        const booklet = saved ? JSON.parse(saved) : [];
        setIsInBooklet(booklet.some((bi: any) => bi.id === (item.id || item.name)));
      } catch {
        setIsInBooklet(false);
      }
    };
    checkState();

    window.addEventListener("booklet-updated", checkState);
    return () => window.removeEventListener("booklet-updated", checkState);
  }, [item]);

  const handleToggleBooklet = () => {
    window.dispatchEvent(new CustomEvent("add-to-booklet", {
      detail: {
        id: item.id || item.name,
        title: item.title || item.name,
        category: item.description || item.meaning || (item.lesson ? `Lição ${item.lesson}` : "Tema de Fé"),
        content: item.content
      }
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[150] flex items-center justify-center p-0 sm:p-4"
    >
      <motion.div 
        initial={{ scale: 0.98, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-card-light dark:bg-card-dark w-full h-full sm:h-[90vh] sm:max-h-[90vh] sm:max-w-4xl sm:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl border-none"
      >
        <div className="bg-secondary p-5 sm:p-8 text-white flex justify-between items-center relative shrink-0">
          <div className="z-10 pr-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-1.5 tracking-tight leading-tight">{item.title || item.name}</h3>
            <p className="text-accent text-xs font-black uppercase tracking-wider">{item.description || item.meaning || 'Estudo Bíblico'}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors z-10 shrink-0">
            <X size={18} />
          </button>
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Library size={140} />
          </div>
        </div>

        <div className="flex-grow p-4 sm:p-8 md:p-10 overflow-y-auto space-y-6 scrollbar-hide">
          <div>
            <h4 className="text-xs sm:text-sm font-black text-secondary dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-border-dark pb-2">
              <Library size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
              Exposição Bíblica Detalhada
            </h4>
            <div className="text-slate-700 dark:text-slate-200 leading-relaxed space-y-4 text-[13.5px] sm:text-[14.5px] md:text-[15.5px] text-left">
              {/* Referência Bíblica integrada na Exposição Bíblica Detalhada */}
              {(() => {
                const verse = getBibleVerseForItem(item);
                if (!verse.text || verse.text === "N/A") return null;
                return (
                  <div className="p-4 sm:p-5 bg-amber-500/[0.04] dark:bg-amber-500/[0.02] border-l-4 border-[#cfaf72] rounded-r-2xl mb-5 space-y-1">
                    <p className="text-xs sm:text-sm md:text-base text-slate-800 dark:text-slate-200 italic font-bold leading-relaxed">
                      "{verse.text}"
                    </p>
                    <p className="text-xs text-[#cfaf72] font-black text-right">
                      — {verse.reference}
                    </p>
                  </div>
                );
              })()}

              {item.content ? (
                <div className="whitespace-pre-wrap font-normal">
                  {item.content}
                </div>
              ) : (
                <p className="italic text-muted">Este conteúdo está sendo expandido para atingir a profundidade de 30+ linhas conforme solicitado. Em breve teremos a versão completa aqui.</p>
              )}
            </div>
          </div>

          {/* Discreet inline banner inside content: ("Estudos → conteúdo → banner", "Histórias → banner discreto") */}
          <div className="my-3 sm:my-4">
            <ThemeBanner type="discreet" />
          </div>



          {/* Libreto compilation action */}
          {item.content && (
            <div className="p-4 bg-gradient-to-tr from-[#16254a]/3 to-transparent dark:from-accent/3 dark:to-transparent rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5 my-1.5">
              <div className="text-left w-full sm:w-auto">
                <h5 className="font-extrabold text-[#cfaf72] text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                  <FileText size={16} />
                  Compilar para PDF / Word
                </h5>
                <p className="text-xs text-muted font-semibold mt-0.5">Reúna até 2 ensinos do seu gosto para baixar em documento unificado livremente.</p>
              </div>
              <button
                onClick={handleToggleBooklet}
                className={cn(
                  "w-full sm:w-auto px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5",
                  isInBooklet 
                    ? "bg-slate-200 dark:bg-slate-800 text-secondary dark:text-accent" 
                    : "bg-[#0b132b] text-white hover:bg-primary"
                )}
              >
                {isInBooklet ? (
                  <>
                    <Check size={12} className="text-accent" /> Remover do Livreto
                  </>
                ) : (
                  <>
                    <Plus size={12} /> Adicionar ao Livreto
                  </>
                )}
              </button>
            </div>
          )}

          <div className="mt-6 p-4 sm:p-6 bg-slate-50/30 dark:bg-slate-800/10 rounded-xl italic text-muted text-xs font-semibold text-center">
            "Examinais as Escrituras, porque vós cuidais ter nelas a vida eterna, e são elas que de mim testificam." - João 5:39
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Navbar({ isDark, toggleDark, isAdmin, setIsAdmin, dbStatus, onSync, supabaseConfigMissing }: { isDark: boolean, toggleDark: () => void, isAdmin: boolean, setIsAdmin: (val: boolean) => void, dbStatus: "connecting" | "online" | "offline", onSync: () => void, supabaseConfigMissing?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const navItems = [
    { name: "Início", path: "/", icon: <HomeIcon size={20} /> },
    { name: "Estudos", path: "/estudos", icon: <BookOpen size={20} /> },
    { name: "Dicionário", path: "/dicionario", icon: <Search size={20} /> },
    { name: "Histórias", path: "/historias", icon: <History size={20} /> },
    { name: "Homens de Deus", path: "/homens-deus", icon: <Users size={20} /> },
    { name: "Teologia", path: "/teologia", icon: <Library size={20} /> },
    { name: "Curso", path: "/curso", icon: <GraduationCap size={20} /> },
    { name: "Mural", path: "/comunidade", icon: <MessageCircle size={20} /> },
    { name: "Apoia a Missão", path: "/apoio", icon: <Heart size={20} className="text-pink-500 animate-pulse" /> },
  ];

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCodeInput.trim() === "ardente94") {
      setIsAdmin(true);
      setAdminCodeInput("");
      setShowAdminLogin(false);
      setErrorMsg("");
      alert("Acesso Administrativo Liberado! Agora você pode criar e excluir matérias em todas as áreas do aplicativo.");
    } else {
      setErrorMsg("Código inválido!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    alert("Saída concluída. Painel administrativo desativado.");
  };

  return (
    <>
      {/* Sleek integrated Top Navbar for both Mobile and Desktop */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-secondary text-slate-800 dark:text-white z-50 px-6 sm:px-8 lg:px-12 flex items-center justify-between border-b border-slate-100 dark:border-white/5 shadow-md">
        {/* Logo and Branding */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-lg sm:rounded-xl flex items-center justify-center rotate-6 shadow-xl shadow-accent/20">
            <BookOpen size={16} className="text-secondary sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">Escola da Fé</h1>
            <p className="hidden sm:block text-[10px] sm:text-xs text-[#cfaf72] font-black uppercase tracking-[0.2em] opacity-80 mt-1">Teologia & Bíblia</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 mx-4 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl font-bold transition-all duration-300 group text-xs xl:text-sm tracking-wide shrink-0",
                location.pathname === item.path 
                  ? "bg-slate-100 dark:bg-white/10 text-secondary dark:text-white shadow-md shadow-black/5" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-secondary dark:hover:text-white"
              )}
            >
              <span className={cn(
                "transition-transform group-hover:scale-110",
                location.pathname === item.path ? "text-[#cfaf72]" : "text-slate-400 group-hover:text-secondary dark:group-hover:text-white"
              )}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions (Supabase Badge, Theme toggle and Admin Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Supabase Connection Status Indicator */}
          {dbStatus === "connecting" && (
            <button
              type="button"
              onClick={onSync}
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-bold font-mono text-[9px] sm:text-[10px] uppercase rounded-xl hover:bg-yellow-500/20 transition-all animate-pulse shrink-0 cursor-pointer"
              title="Sincronizando com Supabase..."
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-ping shrink-0" />
              <span className="hidden sm:inline">Sincronizando</span>
              <span className="sm:hidden">Sinc...</span>
            </button>
          )}

          {dbStatus === "online" && (
            <button
              type="button"
              onClick={onSync}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold font-mono text-[9px] sm:text-[10px] uppercase rounded-xl hover:bg-emerald-500/20 transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-500/5 active:scale-95 duration-150"
              title="Dispositivo Online: Sincronizado com Supabase (Clique p/ atualizar)"
            >
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
              <span className="hidden sm:inline">Supabase Online</span>
              <span className="sm:hidden">Online</span>
            </button>
          )}

          {dbStatus === "offline" && (
            <button
              type="button"
              onClick={onSync}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold font-mono text-[9px] sm:text-[10px] uppercase rounded-xl hover:bg-red-500/20 transition-all shrink-0 cursor-pointer font-black active:scale-95 duration-150"
              title={supabaseConfigMissing ? "Configuração Supabase ausente! Nenhuma Chave ou URL encontrada." : "Offline ou erro ao conectar. Clique para tentar reconectar."}
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-pulse" />
              <span className="hidden sm:inline">{supabaseConfigMissing ? "Configuração Supabase ausente" : "Offline ↻"}</span>
              <span className="sm:hidden">{supabaseConfigMissing ? "Sem Config" : "Offline"}</span>
            </button>
          )}

          {/* Theme Toggler for Desktop & Mobile */}
          <button 
            onClick={toggleDark}
            className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl transition-all cursor-pointer"
            title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
          >
            {isDark ? <Sun size={18} className="text-accent" /> : <Moon size={18} />}
          </button>

          {/* Admin section in Desktop Horizontal Navbar */}
          <div className="hidden lg:block">
            {isAdmin ? (
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#cfaf72]">ADMIN ACTIVATED</span>
                <button 
                  onClick={handleAdminLogout}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-[#1A237E] font-black text-xs rounded-lg transition-all uppercase tracking-wider"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div>
                {showAdminLogin ? (
                  <form onSubmit={handleAdminSubmit} className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                    <input 
                      type="password" 
                      value={adminCodeInput}
                      onChange={(e) => setAdminCodeInput(e.target.value)}
                      placeholder="Código..."
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:border-accent w-28 text-center placeholder:text-xs"
                    />
                    <button 
                      type="submit"
                      className="py-1.5 px-2.5 bg-accent hover:bg-white text-secondary font-black text-xs rounded-lg transition-colors"
                    >
                      OK
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setShowAdminLogin(false); setErrorMsg(""); }}
                      className="text-slate-400 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button 
                    onClick={() => setShowAdminLogin(true)}
                    className="text-xs font-black tracking-widest uppercase text-slate-500 dark:text-slate-400 hover:text-accent px-3 py-2 hover:bg-white/5 rounded-xl transition-all"
                  >
                    🔑 ADMIN
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2.5 bg-slate-100 dark:bg-white/10 rounded-xl hover:bg-slate-200 dark:hover:bg-white/15 transition-all text-slate-700 dark:text-white">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile/Tablet Full Screen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-white dark:bg-secondary z-[90] lg:hidden pt-24 px-6 flex flex-col overflow-y-auto"
          >
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-6 px-8 py-4 rounded-[2rem] text-xl active:scale-95 transition-all",
                    location.pathname === item.path
                      ? "bg-slate-200/70 dark:bg-white/10 text-secondary dark:text-white font-black shadow-md border border-slate-200 dark:border-transparent"
                      : "bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white font-bold border border-slate-100 dark:border-transparent"
                  )}
                >
                  <span className="text-[#cfaf72]">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              {/* Admin mobile login */}
              <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-6">
                {isAdmin ? (
                  <div className="bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-6 text-center">
                    <p className="text-xs font-black uppercase tracking-wider text-[#cfaf72] mb-3">Painel Admin Ativo</p>
                    <button 
                      onClick={() => { handleAdminLogout(); setIsOpen(false); }}
                      className="w-full py-4 bg-emerald-500 text-white font-black text-sm rounded-2xl"
                    >
                      Sair do Modo Admin
                    </button>
                  </div>
                ) : (
                  <div className="text-center px-4">
                    {showAdminLogin ? (
                      <form onSubmit={(e) => { handleAdminSubmit(e); setIsOpen(false); }} className="space-y-3 bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5">
                        <input 
                          type="password" 
                          value={adminCodeInput}
                          onChange={(e) => setAdminCodeInput(e.target.value)}
                          placeholder="Código admin..."
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-center text-sm py-3 px-4 rounded-xl"
                        />
                        <button type="submit" className="w-full py-3 bg-[#cfaf72] text-white font-black rounded-xl">Entrar</button>
                        <button type="button" onClick={() => setShowAdminLogin(false)} className="w-full py-3 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl">Cancelar</button>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setShowAdminLogin(true)}
                        className="text-xs font-black tracking-widest uppercase text-slate-500 dark:text-slate-400 hover:text-accent py-4"
                      >
                        🔑 ADMIN
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const SQL_SCHEMAS = {
  postgres: {
    usuarios: `-- TABELA DE USUÁRIOS (PostgreSQL)\nCREATE TABLE IF NOT EXISTS usuarios (\n    id SERIAL PRIMARY KEY,\n    nome VARCHAR(150) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    senha_hash VARCHAR(255) NOT NULL,\n    cargo VARCHAR(50) DEFAULT 'estudante',\n    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
    comunicados: `-- TABELA DE COMUNICADOS / MURAL (PostgreSQL)\nCREATE TABLE IF NOT EXISTS comunicados (\n    id VARCHAR(100) PRIMARY KEY,\n    titulo VARCHAR(255) NOT NULL,\n    mensagem TEXT NOT NULL,\n    data_publicacao VARCHAR(50) NOT NULL,\n    autor VARCHAR(100) DEFAULT 'Lemos Faya de Arcanjo',\n    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
    redes: `-- TABELA DE CONFIGURAÇÕES SOCIAIS / CONTATOS (PostgreSQL)\nCREATE TABLE IF NOT EXISTS configuracoes_sociais (\n    chave VARCHAR(50) PRIMARY KEY,\n    valor TEXT NOT NULL,\n    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- POPULAR CONFIGURAÇÕES SOCIAIS SEÇÃO WHATSAPP (EVITANDO CONFLITOS)\nINSERT INTO configuracoes_sociais (chave, valor) VALUES \n('whatsapp', '936386566'),\n('instagram', 'https://instagram.com/escoladafe'),\n('youtube', 'https://youtube.com/escoladafe'),\n('facebook', 'https://www.facebook.com/lemosmabiala.faya/')\nON CONFLICT (chave) DO NOTHING;`,
    progresso: `-- TABELA DE PROGRESSO DO ALUNO (PostgreSQL)\nCREATE TABLE IF NOT EXISTS progresso_estudante (\n    id SERIAL PRIMARY KEY,\n    aluno_email VARCHAR(255) NOT NULL,\n    item_id VARCHAR(100) NOT NULL,\n    completado BOOLEAN DEFAULT TRUE,\n    completado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    UNIQUE(aluno_email, item_id)\n);`,
    estudos: `-- TABELA DE ESTUDOS TEMÁTICOS / ARTIGOS (PostgreSQL)\nCREATE TABLE IF NOT EXISTS estudos_basicos (\n    id VARCHAR(100) PRIMARY KEY,\n    titulo VARCHAR(255) NOT NULL,\n    descricao TEXT NOT NULL,\n    categoria VARCHAR(100) NOT NULL,\n    conteudo TEXT NOT NULL,\n    autor VARCHAR(150) DEFAULT 'Lemos Faya de Arcanjo',\n    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`,
    dicionario: `-- TABELA DO DICIONÁRIO BÍBLICO DE TERMOS (PostgreSQL)\nCREATE TABLE IF NOT EXISTS dicionario_biblico (\n    id SERIAL PRIMARY KEY,\n    termo VARCHAR(150) UNIQUE NOT NULL,\n    significado TEXT NOT NULL,\n    referencia_biblica VARCHAR(250)\n);`,
    teologia: `-- TABELA DE EXPOSIÇÕES DOUTRINÁRIAS / TEOLOGIA (PostgreSQL)\nCREATE TABLE IF NOT EXISTS teologia_doutrinas (\n    id VARCHAR(100) PRIMARY KEY,\n    titulo VARCHAR(255) NOT NULL,\n    resumo TEXT NOT NULL,\n    referencias_biblicas TEXT NOT NULL,\n    conteudo_completo TEXT NOT NULL\n);`,
    curso: `-- TABELA DE MÓDULOS E LIÇÕES DO CURSO DE TEOLOGIA (PostgreSQL)\nCREATE TABLE IF NOT EXISTS licoes_curso (\n    id VARCHAR(100) PRIMARY KEY,\n    modulo_titulo VARCHAR(255) NOT NULL,\n    numero_modulo INT NOT NULL,\n    titulo_licao VARCHAR(255) NOT NULL,\n    numero_licao INT NOT NULL,\n    conteudo TEXT NOT NULL,\n    duracao_minutos INT DEFAULT 15\n);`,
    apoio: `-- TABELA DE DADOS DE APOIO À MISSÃO (PostgreSQL)\nCREATE TABLE IF NOT EXISTS dados_apoio (\n    chave VARCHAR(50) PRIMARY KEY,\n    valor TEXT NOT NULL,\n    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- POPULAR DADOS DE APOIO AUTOMATICAMENTE\nINSERT INTO dados_apoio (chave, valor) VALUES\n('banco', 'Banco de Fomento Angola (BFA)'),\n('titular', 'Lemos Faya de Arcanjo'),\n('conta', '39482930291'),\n('iban', 'AO06.0040.0000.3948.2930.2913.3'),\n('transferencia', '936386566')\nON CONFLICT (chave) DO NOTHING;`,
    homens: `-- TABELA DE HOMENS DE DEUS (PostgreSQL)\nCREATE TABLE IF NOT EXISTS homens_de_deus (\n    id VARCHAR(100) PRIMARY KEY,\n    nome VARCHAR(255) NOT NULL,\n    descricao TEXT NOT NULL,\n    imagem TEXT,\n    era VARCHAR(100) DEFAULT 'Contemporâneo',\n    birth_and_death VARCHAR(150),\n    main_legacy VARCHAR(255),\n    bible_verse TEXT,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\n-- ATIVAR ROW LEVEL SECURITY (RLS) NO SUPABASE\nALTER TABLE homens_de_deus ENABLE ROW LEVEL SECURITY;\n\n-- PERMISSÕES RLS\nDROP POLICY IF EXISTS "Leitura pública para todos" ON homens_de_deus;\nDROP POLICY IF EXISTS "Controle total para administradores" ON homens_de_deus;\nDROP POLICY IF EXISTS "Acesso público irrestrito homens" ON homens_de_deus;\nCREATE POLICY "Acesso público irrestrito homens" ON homens_de_deus FOR ALL USING (true) WITH CHECK (true);\n\n-- HABILITAR REALTIME NO SUPABASE (OPERAÇÃO REENTRANTE SEGUNDO REGRAS DO POSTGRES)\nDO $$\nBEGIN\n    IF NOT EXISTS (\n        SELECT 1 FROM pg_publication_rel pr \n        JOIN pg_publication p ON pr.prpubid = p.oid \n        JOIN pg_class c ON pr.prrelid = c.oid \n        WHERE p.pubname = 'supabase_realtime' AND c.relname = 'homens_de_deus'\n    ) THEN\n        ALTER PUBLICATION supabase_realtime ADD TABLE homens_de_deus;\n    END IF;\nEND $$;`
  },
  sqlite: {
    usuarios: `-- TABELA DE USUÁRIOS (SQLite)\nCREATE TABLE IF NOT EXISTS usuarios (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    nome TEXT NOT NULL,\n    email TEXT UNIQUE NOT NULL,\n    senha_hash TEXT NOT NULL,\n    cargo TEXT DEFAULT 'estudante',\n    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP\n);`,
    comunicados: `-- TABELA DE COMUNICADOS / MURAL (SQLite)\nCREATE TABLE IF NOT EXISTS comunicados (\n    id TEXT PRIMARY KEY,\n    titulo TEXT NOT NULL,\n    mensagem TEXT NOT NULL,\n    data_publicacao TEXT NOT NULL,\n    autor TEXT DEFAULT 'Lemos Faya de Arcanjo',\n    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP\n);`,
    redes: `-- TABELA DE CONFIGURAÇÕES SOCIAIS (SQLite)\nCREATE TABLE IF NOT EXISTS configuracoes_sociais (\n    chave TEXT PRIMARY KEY,\n    valor TEXT NOT NULL,\n    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\n-- CONFIGURAÇÕES PREVIAMENTE SETADAS\nINSERT OR IGNORE INTO configuracoes_sociais (chave, valor) VALUES \n('whatsapp', '936386566'),\n('instagram', 'https://instagram.com/escoladafe'),\n('youtube', 'https://youtube.com/escoladafe'),\n('facebook', 'https://www.facebook.com/lemosmabiala.faya/');`,
    progresso: `-- TABELA DE PROGRESSO DO ALUNO (SQLite)\nCREATE TABLE IF NOT EXISTS progresso_estudante (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    aluno_email TEXT NOT NULL,\n    item_id TEXT NOT NULL,\n    completado INTEGER DEFAULT 1,\n    completado_em DATETIME DEFAULT CURRENT_TIMESTAMP,\n    UNIQUE(aluno_email, item_id)\n);`,
    estudos: `-- TABELA DE ESTUDOS TEMÁTICOS (SQLite)\nCREATE TABLE IF NOT EXISTS estudos_basicos (\n    id TEXT PRIMARY KEY,\n    titulo TEXT NOT NULL,\n    descricao TEXT NOT NULL,\n    categoria TEXT NOT NULL,\n    conteudo TEXT NOT NULL,\n    autor TEXT DEFAULT 'Lemos Faya de Arcanjo',\n    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP\n);`,
    dicionario: `-- TABELA DO DICIONÁRIO BÍBLICO (SQLite)\nCREATE TABLE IF NOT EXISTS dicionario_biblico (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    termo TEXT UNIQUE NOT NULL,\n    significado TEXT NOT NULL,\n    referencia_biblica TEXT\n);`,
    teologia: `-- TABELA DE EXPOSIÇÕES DOUTRINÁRIAS (SQLite)\nCREATE TABLE IF NOT EXISTS teologia_doutrinas (\n    id TEXT PRIMARY KEY,\n    titulo TEXT NOT NULL,\n    resumo TEXT NOT NULL,\n    referencias_biblicas TEXT NOT NULL,\n    conteudo_completo TEXT NOT NULL\n);`,
    curso: `-- TABELA DE LIÇÕES DO CURSO DE TEOLOGIA (SQLite)\nCREATE TABLE IF NOT EXISTS licoes_curso (\n    id TEXT PRIMARY KEY,\n    modulo_titulo TEXT NOT NULL,\n    numero_modulo INTEGER NOT NULL,\n    titulo_licao TEXT NOT NULL,\n    numero_licao INTEGER NOT NULL,\n    conteudo TEXT NOT NULL,\n    duracao_minutos INTEGER DEFAULT 15\n);`,
    apoio: `-- TABELA DE DADOS DE APOIO À MISSÃO (SQLite)\nCREATE TABLE IF NOT EXISTS dados_apoio (\n    chave TEXT PRIMARY KEY,\n    valor TEXT NOT NULL,\n    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP\n);\n\n-- CONFIGURAÇÕES INICIAIS DE APOIO\nINSERT OR IGNORE INTO dados_apoio (chave, valor) VALUES \n('banco', 'Banco de Fomento Angola (BFA)'),\n('titular', 'Lemos Faya de Arcanjo'),\n('conta', '39482930291'),\n('iban', 'AO06.0040.0000.3948.2930.2913.3'),\n('transferencia', '936386566');`,
    homens: `-- TABELA DE HOMENS DE DEUS (SQLite)\nCREATE TABLE IF NOT EXISTS homens_de_deus (\n    id TEXT PRIMARY KEY,\n    nome TEXT NOT NULL,\n    descricao TEXT NOT NULL,\n    imagem TEXT,\n    era TEXT DEFAULT 'Contemporâneo',\n    birth_and_death TEXT,\n    main_legacy TEXT,\n    bible_verse TEXT,\n    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\n);`
  }
};

function Home({ 
  onSelectItem, 
  announcements, 
  setAnnouncements, 
  isAdmin,
  triggerConfirm,
  socialLinks,
  setSocialLinks,
  privacyText,
  setPrivacyText,
  termsText,
  setTermsText,
  supportDetails,
  setSupportDetails
}: { 
  onSelectItem: (item: any) => void;
  announcements: any[];
  setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  socialLinks: { whatsapp: string; instagram: string; youtube: string; facebook: string };
  setSocialLinks: React.Dispatch<React.SetStateAction<{ whatsapp: string; instagram: string; youtube: string; facebook: string }>>;
  privacyText: string;
  setPrivacyText: React.Dispatch<React.SetStateAction<string>>;
  termsText: string;
  setTermsText: React.Dispatch<React.SetStateAction<string>>;
  supportDetails: { banco: string; titular: string; conta: string; iban: string; transferencia: string };
  setSupportDetails: React.Dispatch<React.SetStateAction<{ banco: string; titular: string; conta: string; iban: string; transferencia: string }>>;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("notification"); // "notification" | "publication" | "alert" | "teaching"
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [activeSqlTab, setActiveSqlTab] = useState<"postgres" | "sqlite">("postgres");
  const [activeSqlTable, setActiveSqlTable] = useState<"usuarios" | "comunicados" | "redes" | "progresso" | "estudos" | "dicionario" | "teologia" | "curso" | "apoio" | "homens">("usuarios");
  const [copied, setCopied] = useState(false);

  const handleCopySql = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Pressione Ctrl+C para copiar.");
    }
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMessage) {
      alert("Por favor, preencha todos os campos da publicação/notificação.");
      return;
    }
    const newNotice = {
      id: "anuncio_" + Date.now(),
      title: newTitle,
      date: new Date().toLocaleDateString("pt-BR"),
      type: newType,
      message: newMessage
    };
    setAnnouncements(prev => [newNotice, ...prev]);
    setNewTitle("");
    setNewMessage("");
    setNewType("notification");
    setIsFormOpen(false);
    alert("Publicada/Enviada com sucesso no mural!");
  };

  const handleDeleteAnnouncement = (id: string) => {
    triggerConfirm(
      "Excluir Comunicado",
      "Você tem certeza que deseja excluir permanentemente este comunicado do mural da comunidade?",
      () => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      }
    );
  };

  const stats = [
    { label: "Estudos Profundos", count: "50+", icon: <BookOpen size={24} />, color: "bg-amber-500", path: "/estudos" },
    { label: "Homens de Deus", count: "Adicionados", icon: <Users size={24} />, color: "bg-violet-600", path: "/homens-deus" },
    { label: "Nomes Bíblicos", count: "100+", icon: <Search size={24} />, color: "bg-blue-500", path: "/dicionario" },
    { label: "Lugares & Biografias", count: "50+", icon: <MapPin size={24} />, color: "bg-purple-500", path: "/historias" },
    { label: "Lições do Curso", count: "Completo", icon: <GraduationCap size={24} />, color: "bg-emerald-500", path: "/curso" },
    { label: "Apoia a Missão", count: "Ajude 💙", icon: <Heart size={24} />, color: "bg-pink-500 animate-pulse", path: "/apoio" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-16"
    >
      <header className="py-10 sm:py-20 bg-primary rounded-[2rem] sm:rounded-[4rem] p-5 sm:p-10 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-primary/30 border-none">
        <div className="relative z-10 max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-accent text-secondary text-xs sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] rounded-full mb-6 sm:mb-10 shadow-lg"
          >
            Plataforma Completa de Ensino
          </motion.span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight sm:leading-[1.05] tracking-tight">
            O Todo do <br className="hidden sm:inline" />Conhecimento.
          </h2>
          <p className="text-base sm:text-2xl text-white/80 leading-relaxed font-medium mb-8 sm:mb-12 max-w-xl">
            Aprofunde-se em cada detalhe das Escrituras com nossa base completa de teologia sistemática e histórica.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <Link to="/estudos" className="px-6 sm:px-10 py-3 sm:py-5 bg-white text-primary rounded-xl sm:rounded-[2rem] font-black text-sm sm:text-base md:text-xl hover:scale-105 transition-all shadow-xl text-center w-full sm:w-auto">Ver Tudo</Link>
            <Link to="/curso" className="px-6 sm:px-10 py-3 sm:py-5 bg-accent text-secondary rounded-xl sm:rounded-[2rem] font-black text-sm sm:text-base md:text-xl hover:scale-105 transition-all shadow-xl text-center w-full sm:w-auto">Iniciar Jornada</Link>
          </div>
        </div>
        <div className="absolute -top-20 -right-20 p-12 opacity-10 blur-3xl pointer-events-none">
          <BookOpen size={700} />
        </div>
      </header>

      {/* MURAL DE AVISOS & NOVIDADES DA COMUNIDADE (Início Area Addition) */}
      <section className="bg-gradient-to-br from-[#0b132b]/5 to-[#0b132b]/10 dark:from-slate-900/50 dark:to-slate-800/40 rounded-[2.5rem] sm:rounded-[3rem] p-5 sm:p-10 border border-[#cfaf72]/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-xs bg-accent/20 text-[#cfaf72] font-black tracking-widest uppercase px-4 py-2 rounded-full border border-accent/20">Área de Novidades</span>
            <h3 className="text-3xl font-black text-heading tracking-tight mt-3">Mural da Comunidade</h3>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-6 py-3 bg-[#cfaf72] text-secondary font-black text-xs uppercase tracking-wider rounded-xl hover:bg-white transition-all flex items-center gap-2"
            >
              {isFormOpen ? "Fechar Painel" : "Adicionar Comunicado"}
            </button>
          )}
        </div>

        {isFormOpen && isAdmin && (
          <form onSubmit={handleAddAnnouncement} className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-[#cfaf72]/30 space-y-4 shadow-xl">
            <h4 className="font-black text-heading text-lg flex items-center gap-2 text-[#cfaf72]">
              <span>📢</span> Criar Nova Publicação ou Notificação (Painel Admin)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Título da Publicação/Notificação</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Novo Estódulo de Soteriologia Disponível!"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Tipo de Mensagem</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-bold"
                >
                  <option value="notification">📢 Notificação</option>
                  <option value="publication">📝 Publicação</option>
                  <option value="alert">⚠️ Alerta Urgente</option>
                  <option value="teaching">📖 Ensino Rápido</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block mb-1">Conteúdo principal da Mensagem</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escreva a notificação ou publicação detalhada aqui..."
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm leading-relaxed"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-secondary hover:bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
            >
              Emitir Publicação / Notificação
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.length === 0 ? (
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">Nenhum aviso no mural de avisos da Escola.</p>
          ) : (
            announcements.map((a: any) => {
              // Custom colors based on Type of announcement
              let badgeColor = "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400";
              let badgeLabel = "📢 Notificação";
              
              if (a.type === "publication") {
                badgeColor = "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400";
                badgeLabel = "📝 Publicação";
              } else if (a.type === "alert") {
                badgeColor = "bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-500/20";
                badgeLabel = "⚠️ Alerta";
              } else if (a.type === "teaching") {
                badgeColor = "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400";
                badgeLabel = "📖 Ensino Rápido";
              }

              return (
                <div key={a.id} className="relative p-6 bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark flex flex-col justify-between shadow-xl group hover:border-[#cfaf72]/20 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase font-mono">{a.date}</span>
                        <span className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md", badgeColor)}>
                          {badgeLabel}
                        </span>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteAnnouncement(a.id)}
                          className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Excluir aviso"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <h4 className="font-extrabold text-heading text-lg mb-2">{a.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold block whitespace-pre-wrap">{a.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* SEÇÃO EDITAR REDES SOCIAIS E WHATSAPP (Apenas Admin) */}
      {isAdmin && (
        <section className="bg-gradient-to-br from-indigo-500/5 to-pink-500/5 dark:from-indigo-950/20 dark:to-pink-950/20 rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 md:p-10 border border-indigo-500/20 shadow-2xl space-y-8">
          <div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-black tracking-widest uppercase px-4 py-2 rounded-full border border-indigo-500/15">Painel Admin</span>
            <h3 className="text-3xl font-black text-heading tracking-tight mt-3">Configurações Gerais do Aplicativo</h3>
            <p className="text-muted text-sm mt-1">Gerencie canais sociais e os textos legais exibidos para os usuários finais nesta plataforma.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">1. Redes Sociais & Canais Oficiais</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">WhatsApp de Suporte (Número "936386566" ou Link completo)</label>
                <input
                  type="text"
                  value={socialLinks.whatsapp}
                  onChange={(e) => setSocialLinks((prev: any) => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="Exemplo: 936386566"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-[#cfaf72] uppercase tracking-wider block">Instagram do Ministério</label>
                <input
                  type="text"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks((prev: any) => ({ ...prev, instagram: e.target.value }))}
                  placeholder="Exemplo: https://instagram.com/escoladafe"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-red-500 uppercase tracking-wider block">Canal do YouTube</label>
                <input
                  type="text"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks((prev: any) => ({ ...prev, youtube: e.target.value }))}
                  placeholder="Exemplo: https://youtube.com/escoladafe"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-[#cfaf72]/30 text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-blue-500 uppercase tracking-wider block">Página do Facebook</label>
                <input
                  type="text"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks((prev: any) => ({ ...prev, facebook: e.target.value }))}
                  placeholder="Exemplo: https://facebook.com/escoladafe"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">2. Textos de Regulamentos, Privacidade e Uso</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-heading uppercase tracking-wider block">Texto da Política de Privacidade</label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Use dois Enter (\n\n) para parágrafo</span>
                </div>
                <textarea
                  rows={8}
                  value={privacyText}
                  onChange={(e) => setPrivacyText(e.target.value)}
                  placeholder="Escreva a política de privacidade..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-2xl focus:outline-none focus:border-accent text-xs font-medium leading-relaxed resize-y font-sans"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-heading uppercase tracking-wider block">Texto dos Termos de Uso</label>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Use dois Enter (\n\n) para parágrafo</span>
                </div>
                <textarea
                  rows={8}
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  placeholder="Escreva os Termos de Uso..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-2xl focus:outline-none focus:border-accent text-xs font-medium leading-relaxed resize-y font-sans"
                />
              </div>
            </div>
          </div>

          {/* DADOS DE APOIO À MISSÃO - CONFIGURATIONS BLOCK */}
          <div className="space-y-4 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">2.5. Dados para Apoio à Missão (Aba Apoia a Missão)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card-light dark:bg-card-dark p-6 rounded-2xl border border-border-light dark:border-border-dark shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">🏦 Nome do Banco</label>
                <input
                  type="text"
                  value={supportDetails.banco}
                  onChange={(e) => setSupportDetails((prev: any) => ({ ...prev, banco: e.target.value }))}
                  placeholder="Exemplo: Banco BFA"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">👤 Titular da Conta</label>
                <input
                  type="text"
                  value={supportDetails.titular}
                  onChange={(e) => setSupportDetails((prev: any) => ({ ...prev, titular: e.target.value }))}
                  placeholder="Nome completo do titular"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">🔢 Número de Conta</label>
                <input
                  type="text"
                  value={supportDetails.conta}
                  onChange={(e) => setSupportDetails((prev: any) => ({ ...prev, conta: e.target.value }))}
                  placeholder="Número de conta bancária"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">📱 Número p/ Transferência / Multicaixa</label>
                <input
                  type="text"
                  value={supportDetails.transferencia}
                  onChange={(e) => setSupportDetails((prev: any) => ({ ...prev, transferencia: e.target.value }))}
                  placeholder="Telemóvel ou número de transferência"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-heading uppercase tracking-wider block">📄 Código IBAN</label>
                <input
                  type="text"
                  value={supportDetails.iban}
                  onChange={(e) => setSupportDetails((prev: any) => ({ ...prev, iban: e.target.value }))}
                  placeholder="IBAN completo"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-semibold"
                />
              </div>
            </div>

            {/* Sync All Configurations Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const payload = [
                      { chave: "whatsapp", valor: socialLinks.whatsapp || "" },
                      { chave: "instagram", valor: socialLinks.instagram || "" },
                      { chave: "youtube", valor: socialLinks.youtube || "" },
                      { chave: "facebook", valor: socialLinks.facebook || "" },
                      { chave: "privacy_text", valor: privacyText || "" },
                      { chave: "terms_text", valor: termsText || "" },
                      { chave: "support_banco", valor: supportDetails.banco || "" },
                      { chave: "support_titular", valor: supportDetails.titular || "" },
                      { chave: "support_conta", valor: supportDetails.conta || "" },
                      { chave: "support_transferencia", valor: supportDetails.transferencia || "" },
                      { chave: "support_iban", valor: supportDetails.iban || "" }
                    ];
                    const res = await fetch("/api/db/config/save", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                      alert("Configurações gerais sincronizadas com sucesso no Supabase!");
                    } else {
                      throw new Error("Falha ao salvar");
                    }
                  } catch (err) {
                    alert("Erro ao salvar configurações no Supabase. O dispositivo pode estar offline.");
                  }
                }}
                className="px-8 py-3.5 bg-accent hover:bg-amber-600 text-secondary font-black text-xs uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all cursor-pointer"
              >
                <Database size={14} /> Salvar Configurações no Supabase
              </button>
            </div>
          </div>

          {/* 3. SQL TABLES PLAYGROUND FOR INTEGRATION */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <Database className="text-indigo-400 animate-pulse" size={18} />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">3. Biblioteca de Tabelas SQL (Pronto para Colar)</h4>
            </div>
            
            <div className="bg-card-light dark:bg-card-dark p-6 rounded-3xl border border-border-light dark:border-border-dark shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="text-base font-extrabold text-heading">Estrutura de Tabelas Relacionais</h5>
                  <p className="text-xs text-muted leading-relaxed font-semibold mt-1">
                    Copie as tabelas para integrar a Escola da Fé com bancos corporativos tradicionais. Desenvolvido sob medida por Lemos Faya de Arcanjo.
                  </p>
                </div>

                {/* Database driver filter tabs */}
                <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setActiveSqlTab("postgres")}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all",
                      activeSqlTab === "postgres"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    PostgreSQL / MySQL
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSqlTab("sqlite")}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all",
                      activeSqlTab === "sqlite"
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    SQLite
                  </button>
                </div>
              </div>

              {/* Table selection selectors */}
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("usuarios")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "usuarios"
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  👤 Usuários
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("comunicados")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "comunicados"
                      ? "bg-[#cfaf72]/15 border-[#cfaf72]/30 text-[#cfaf72] shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  📢 Mural / Avisos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("redes")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "redes"
                      ? "bg-pink-500/10 border-pink-500/30 text-pink-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  🌐 Configs Sociais
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("progresso")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "progresso"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  📈 Progresso Aluno
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("estudos")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "estudos"
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  📚 Estudos Básicos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("dicionario")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "dicionario"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  📖 Dicionário Bíblico
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("teologia")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "teologia"
                      ? "bg-purple-500/10 border-purple-500/30 text-purple-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  ⛪ Teologia Sistemática
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("curso")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "curso"
                      ? "bg-teal-500/10 border-teal-500/30 text-teal-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  🎓 Lições do Curso
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("apoio")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "apoio"
                      ? "bg-pink-500/15 border-pink-500/30 text-pink-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  💙 Apoio à Missão
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSqlTable("homens")}
                  className={cn(
                    "px-4.5 py-3 rounded-xl border transition-all uppercase tracking-wider text-xs font-black",
                    activeSqlTable === "homens"
                      ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-500 shadow-md"
                      : "border-border-light dark:border-border-dark text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                  🔥 Homens de Deus
                </button>
              </div>

              {/* Code Panel Display */}
              <div className="relative group space-y-3">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      const sqlCode = SQL_SCHEMAS[activeSqlTab][activeSqlTable];
                      handleCopySql(sqlCode);
                    }}
                    className="absolute right-4 top-4 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-[#cfaf72] hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xl z-10"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="text-[#cfaf72]" />
                        Copiar SQL
                      </>
                    )}
                  </button>

                  <pre className="font-mono bg-slate-950 dark:bg-slate-950 text-emerald-400 border border-slate-900 shadow-2xl p-6 sm:p-8 rounded-2xl text-[11px] font-semibold leading-relaxed tracking-wide min-h-[160px] max-h-[300px] select-all scrollbar-thin whitespace-pre-wrap break-all sm:break-words overflow-y-auto">
                    <code>
                      {SQL_SCHEMAS[activeSqlTab][activeSqlTable]}
                    </code>
                  </pre>
                </div>

                {activeSqlTab === "sqlite" ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-start gap-2.5 leading-relaxed">
                    <span className="text-sm shrink-0 mt-0.5">⚠️</span>
                    <div>
                      <strong className="text-amber-800 dark:text-amber-300 block mb-0.5">Aviso Importante do Driver (SQLite):</strong>
                      Este código usa a sintaxe <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono text-[10px]">INSERT OR IGNORE</code> que é exclusiva do SQLite. 
                      Se seu banco for <strong>PostgreSQL</strong>, isso gerará o erro <strong>"ERROR: 42601 syntax error near OR"</strong>. 
                      Selecione a aba superior <span className="underline cursor-pointer text-heading" onClick={() => setActiveSqlTab("postgres")}>PostgreSQL / MySQL</span> para obter o script correto.
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-700 dark:text-indigo-400 font-semibold flex items-start gap-2.5 leading-relaxed">
                    <span className="text-sm shrink-0 mt-0.5">🐘</span>
                    <div>
                      <strong className="text-indigo-800 dark:text-indigo-300 block mb-0.5">Banco Ativo: PostgreSQL / CockroachDB</strong>
                      Este script é 100% ideal para bancos corporativos que usam Postgres. Utiliza a elegante cláusula <code className="bg-indigo-500/20 px-1 py-0.5 rounded font-mono text-[10px]">ON CONFLICT (chave) DO NOTHING</code> para precaver e evitar duplicações silenciosamente.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DASHBOARD DE ENSINO */}
      <section className="space-y-10">
        <div className="flex items-center gap-6">
          <div className="w-2 h-10 bg-accent rounded-full" />
          <h3 className="text-4xl font-black text-heading tracking-tight">Biblioteca Digital</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat) => {
            const isNumeric = /^\d+\+?$/.test(stat.count);
            return (
              <Link 
                key={stat.label} 
                to={stat.path}
                className="group bg-card-light dark:bg-card-dark p-4 sm:p-5 md:p-6 rounded-3xl border border-border-light dark:border-border-dark hover:border-accent hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center shadow-xl w-full min-w-0"
              >
                <div className={cn("w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 shadow-md group-hover:rotate-12 transition-all shrink-0", stat.color)}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 18 })}
                </div>
                <span className={cn(
                  "font-black text-heading mb-1 tracking-tight w-full px-1 break-words leading-none",
                  isNumeric ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl" : "text-[10px] sm:text-xs md:text-sm text-accent uppercase tracking-wider"
                )}>
                  {stat.count}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-muted uppercase tracking-wider leading-tight break-words max-w-full text-center mt-1">
                  {stat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sponsor Native Ad between feeds as requested: ("Início: 1 anúncio nativo no feed (entre conteúdos)") */}
      <NativeFeedAd positionIndex={0} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <div className="space-y-12">
          <h3 className="text-3xl font-black text-heading tracking-tight flex items-center gap-4">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            Destaques Teológicos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card group border-none shadow-2xl p-5 sm:p-8 md:p-10 rounded-[2rem]">
              <div className="flex justify-between items-start mb-10">
                <h4 className="font-black text-3xl text-heading tracking-tight">Temas</h4>
                <Link to="/estudos" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"><ChevronRight size={20} /></Link>
              </div>
              <div className="space-y-5">
                {[...BIBLICAL_THEMES].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR')).slice(0, 4).map((theme) => (
                  <div 
                    key={theme.id} 
                    onClick={() => onSelectItem(theme)}
                    className="flex items-center gap-3 sm:gap-5 p-3.5 sm:p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl sm:rounded-[2rem] transition-all cursor-pointer group/item hover:bg-primary shadow-sm"
                  >
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-xl sm:text-2xl shadow-sm transition-all group-hover/item:rotate-12 group-hover/item:text-white shrink-0">📖</div>
                    <span className="text-sm sm:text-lg font-black text-heading group-hover/item:text-white leading-tight">{theme.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-none shadow-2xl p-5 sm:p-8 md:p-10 rounded-[2rem]">
              <div className="flex justify-between items-start mb-10">
                <h4 className="font-black text-3xl text-heading tracking-tight">Dicionário</h4>
                <Link to="/dicionario" className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-primary hover:bg-primary hover:text-white transition-all"><ChevronRight size={20} /></Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...BIBLICAL_NAMES].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).slice(0, 8).map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => onSelectItem(item)}
                    className="bg-slate-50 dark:bg-slate-800/40 p-3 sm:p-5 rounded-xl sm:rounded-[1.5rem] text-xs sm:text-sm font-black text-center text-slate-600 dark:text-slate-300 break-words whitespace-normal hover:bg-secondary hover:text-white transition-all shadow-sm active:scale-95 border border-transparent hover:border-accent"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="text-3xl font-black text-heading tracking-tight flex items-center gap-4">
            <div className="w-1.5 h-8 bg-purple-500 rounded-full" />
            Lugares que Marcaram a História
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[...BIBLICAL_STORIES].filter(s => s.type === 'place').sort((a, b) => a.title.localeCompare(b.title, 'pt-BR')).slice(0, 4).map((story) => (
              <div key={story.id} onClick={() => onSelectItem(story)} className="group cursor-pointer">
                <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-[3rem] mb-6 overflow-hidden shadow-xl transition-all group-hover:shadow-2xl group-hover:-translate-y-2 relative">
                  <div className="absolute inset-0 bg-secondary flex items-center justify-center">
                    <MapPin size={48} className="text-accent/30 group-hover:scale-125 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                    <span className="text-white text-[10px] font-black uppercase tracking-[0.3em] bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">Lugar Sagrado</span>
                  </div>
                </div>
                <div className="px-4">
                  <h5 className="font-black text-heading text-2xl mb-2 group-hover:text-primary transition-colors tracking-tight">{story.title}</h5>
                  <p className="text-base text-muted line-clamp-2 leading-relaxed font-medium">{story.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Studies({ 
  onSelectItem, 
  themes, 
  setThemes, 
  isAdmin,
  triggerConfirm
}: { 
  onSelectItem: (item: any) => void;
  themes: any[];
  setThemes: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newBibleVerse, setNewBibleVerse] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newContent) {
      alert("Por favor, preencha todos os campos do estudo.");
      return;
    }

    if (editingId) {
      setThemes(prev => prev.map(t => {
        if (t.id === editingId) {
          return {
            ...t,
            title: newTitle,
            description: newDesc,
            content: newContent,
            bibleVerse: newBibleVerse
          };
        }
        return t;
      }));
      
      // Hit Supabase API via backend
      fetch("/api/db/estudos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          titulo: newTitle,
          descricao: newDesc,
          categoria: "Estudo Bíblico",
          conteudo: newContent,
          referencia_biblica: newBibleVerse
        })
      }).catch(err => console.warn("Erro ao salvar estudo via API (Executando em modo offline local):", err));

      setEditingId(null);
      alert("Estudo bíblico atualizado com sucesso!");
    } else {
      const newId = "estudo_" + Date.now();
      const newTheme = {
        id: newId,
        title: newTitle,
        description: newDesc,
        category: "Estudo Bíblico",
        content: newContent,
        bibleVerse: newBibleVerse
      };
      setThemes(prev => [newTheme, ...prev]);

      // Hit Supabase API via backend
      fetch("/api/db/estudos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          titulo: newTitle,
          descricao: newDesc,
          categoria: "Estudo Bíblico",
          conteudo: newContent,
          referencia_biblica: newBibleVerse
        })
      }).catch(err => console.warn("Erro ao adicionar estudo via API (Executando em modo offline local):", err));

      alert("Estudo bíblico adicionado com sucesso!");
    }

    setNewTitle("");
    setNewDesc("");
    setNewContent("");
    setNewBibleVerse("");
    setIsFormOpen(false);
  };

  const handleDeleteTheme = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerConfirm(
      "Confirmar Exclusão de Estudo",
      "Você deseja realmente deletar permanentemente este estudo temático do banco de dados?",
      () => {
        setThemes(prev => prev.filter(t => t.id !== id));
        
        // Track the deleted ID in local list to avoid re-pulling during synchronization
        const deleted = JSON.parse(localStorage.getItem("escola_da_fe_deleted_ids") || "[]");
        if (!deleted.includes(id)) {
          deleted.push(id);
          localStorage.setItem("escola_da_fe_deleted_ids", JSON.stringify(deleted));
        }

        // Delete from Supabase via backend API
        fetch(`/api/db/estudos/${id}`, {
          method: "DELETE"
        }).catch(err => console.warn("Erro ao deletar estudo via API (Exclusão agendada):", err));

        if (editingId === id) {
          setEditingId(null);
          setNewTitle("");
          setNewDesc("");
          setNewContent("");
          setNewBibleVerse("");
        }
      }
    );
  };

  const filtered = themes
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black text-heading mb-6 tracking-tight">Estudos Temáticos</h2>
          <p className="text-muted text-xl leading-relaxed font-medium">Estude temas fundamentais com base sólida nas Escrituras e estudos exegéticos de alta profundidade.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (isFormOpen && editingId) {
                setEditingId(null);
                setNewTitle("");
                setNewDesc("");
                setNewContent("");
                setNewBibleVerse("");
              }
              setIsFormOpen(!isFormOpen);
            }}
            className="px-6 py-4 bg-accent text-secondary font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 transition-all self-start md:self-center"
          >
            {isFormOpen ? "Fechar Painel" : "Criar Novo Estudo"}
          </button>
        )}
      </div>

      {isFormOpen && isAdmin && (
        <form onSubmit={handleAddTheme} className="p-8 bg-card-light dark:bg-card-dark rounded-3xl border border-accent/20 space-y-4 max-w-3xl">
          <h3 className="font-extrabold text-heading text-xl">
            {editingId ? "Editar Estudo Bíblico" : "Criar Estudo Bíblico"}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título do Estudo..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descrição rápida da lição..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
            <div className="space-y-1">
              <label className="text-xs font-black text-[#cfaf72] dark:text-amber-400 uppercase tracking-widest block">Exposição Bíblica Detalhada</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Escreva a exegese teológica completa aqui..."
                rows={6}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-4 px-5 rounded-3xl focus:outline-none focus:border-accent text-sm font-medium leading-relaxed"
              />
            </div>
            <input
              type="text"
              value={newBibleVerse}
              onChange={(e) => setNewBibleVerse(e.target.value)}
              placeholder="Texto ou Versículo Bíblico Principal (ex: João 3:16)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              {editingId ? "Salvar Alterações" : "Adicionar Estudo"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewTitle("");
                  setNewDesc("");
                  setNewContent("");
                  setNewBibleVerse("");
                  setIsFormOpen(false);
                }}
                className="px-8 py-3.5 bg-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      <div className="relative max-w-xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar entre os temas profundos..."
          className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-card-light dark:bg-card-dark border-none shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-heading text-lg font-bold placeholder:font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Studies discreet ad banner as requested: ("Estudos → Banner discreto") */}
      <ThemeBanner type="discreet" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((theme, i) => (
          <motion.div 
            key={theme.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            onClick={() => onSelectItem(theme)}
            className="card group cursor-pointer border-none shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                  📖
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(theme.id);
                        setNewTitle(theme.title || "");
                        setNewDesc(theme.description || "");
                        setNewContent(theme.content || "");
                        setNewBibleVerse(theme.bibleVerse || "");
                        setIsFormOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-500/10 rounded-xl transition-all"
                      title="Editar estudo"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTheme(theme.id, e)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Excluir estudo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="font-black text-2xl text-heading mb-4 group-hover:text-primary transition-colors leading-tight">{theme.title}</h3>
              <p className="text-sm text-muted line-clamp-4 leading-relaxed mb-8 font-medium">{theme.description}</p>
            </div>
            <div className="flex items-center gap-3 text-primary font-black text-xs uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform">
              Ver Estudo Completo <ChevronRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Dictionary({ 
  onSelectItem, 
  names, 
  setNames, 
  isAdmin,
  triggerConfirm
}: { 
  onSelectItem: (item: any) => void;
  names: any[];
  setNames: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBibleVerse, setNewBibleVerse] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  const handleAddName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMeaning || !newDesc) {
      alert("Por favor, preencha todos os campos do nome.");
      return;
    }

    const finalContent = newContent || `O nome ${newName} significa "${newMeaning}". ${newDesc}`;

    if (editingName) {
      setNames(prev => prev.map(n => {
        if (n.name === editingName) {
          return {
            ...n,
            name: newName,
            meaning: newMeaning,
            description: newDesc,
            bibleVerse: newBibleVerse,
            content: finalContent
          };
        }
        return n;
      }));

      // If the word term itself changed, delete the old term first
      if (editingName !== newName) {
        fetch(`/api/db/dicionario/${editingName}`, {
          method: "DELETE"
        }).catch(err => console.warn(err));
      }

      // Add/Upsert new term row
      fetch("/api/db/dicionario/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          termo: newName,
          significado: newMeaning,
          descricao: newDesc,
          conteudo: finalContent,
          referencia_biblica: newBibleVerse
        })
      }).catch(err => console.warn("Erro ao salvar dicionário via API:", err));

      setEditingName(null);
      alert("Nome atualizado com sucesso!");
    } else {
      const nameItem = {
        name: newName,
        meaning: newMeaning,
        description: newDesc,
        bibleVerse: newBibleVerse,
        content: finalContent
      };
      setNames(prev => [nameItem, ...prev]);

      // Add/Upsert dictionary term row to Supabase
      fetch("/api/db/dicionario/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          termo: newName,
          significado: newMeaning,
          descricao: newDesc,
          conteudo: finalContent,
          referencia_biblica: newBibleVerse
        })
      }).catch(err => console.warn("Erro ao adicionar termo via API:", err));

      alert("Nome adicionado ao dicionário!");
    }

    setNewName("");
    setNewMeaning("");
    setNewDesc("");
    setNewBibleVerse("");
    setNewContent("");
    setIsFormOpen(false);
  };

  const handleDeleteName = (nameToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerConfirm(
      "Confirmar Remoção do Dicionário",
      `Você deseja realmente excluir permanentemente o nome "${nameToDelete}" do Dicionário Bíblico?`,
      () => {
        setNames(prev => prev.filter(n => n.name !== nameToDelete));

        // Track the deleted term in local list to avoid re-pulling during synchronization
        const deleted = JSON.parse(localStorage.getItem("escola_da_fe_deleted_ids") || "[]");
        if (!deleted.includes(nameToDelete)) {
          deleted.push(nameToDelete);
          localStorage.setItem("escola_da_fe_deleted_ids", JSON.stringify(deleted));
        }

        // Delete from Supabase database
        fetch(`/api/db/dicionario/${nameToDelete}`, {
          method: "DELETE"
        }).catch(err => console.warn("Erro ao deletar termo via API:", err));

        if (editingName === nameToDelete) {
          setEditingName(null);
          setNewName("");
          setNewMeaning("");
          setNewDesc("");
          setNewBibleVerse("");
          setNewContent("");
        }
      }
    );
  };

  const filtered = names
    .filter(n => 
      n.name.toLowerCase().includes(search.toLowerCase()) || 
      n.meaning.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black text-heading mb-6 tracking-tight">Dicionário de Nomes</h2>
          <p className="text-muted text-xl leading-relaxed font-medium">Os nomes na Bíblia revelam identidades, propósitos e a vontade soberana de Deus sobre Seus servos.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (isFormOpen && editingName) {
                setEditingName(null);
                setNewName("");
                setNewMeaning("");
                setNewDesc("");
                setNewBibleVerse("");
                setNewContent("");
              }
              setIsFormOpen(!isFormOpen);
            }}
            className="px-6 py-4 bg-accent text-secondary font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 transition-all self-start md:self-center"
          >
            {isFormOpen ? "Fechar Painel" : "Adicionar Nome"}
          </button>
        )}
      </div>

      {isFormOpen && isAdmin && (
        <form onSubmit={handleAddName} className="p-8 bg-card-light dark:bg-card-dark rounded-3xl border border-accent/20 space-y-4 max-w-3xl">
          <h3 className="font-extrabold text-heading text-xl">
            {editingName ? "Editar Nome no Dicionário" : "Inserir Nome no Dicionário"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome Bíblico (ex: Emanuel)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
            <input
              type="text"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              placeholder="Significado espiritual..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Origem, referências e detalhes espirituais deste nome..."
            rows={3}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-3xl focus:outline-none focus:border-accent text-sm"
          />
          <div className="space-y-1">
            <label className="text-xs font-black text-[#cfaf72] dark:text-amber-400 uppercase tracking-widest block">Exposição Bíblica Detalhada</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Digite o texto exegético completo deste nome bíblico..."
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-3xl focus:outline-none focus:border-accent text-sm leading-relaxed"
            />
          </div>
          <input
            type="text"
            value={newBibleVerse}
            onChange={(e) => setNewBibleVerse(e.target.value)}
            placeholder="Texto ou Versículo Bíblico Principal (ex: Mateus 1:23 - Deus conosco)..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              {editingName ? "Salvar Alterações" : "Adicionar ao Dicionário"}
            </button>
            {editingName && (
              <button
                type="button"
                onClick={() => {
                  setEditingName(null);
                  setNewName("");
                  setNewMeaning("");
                  setNewDesc("");
                  setNewBibleVerse("");
                  setNewContent("");
                  setIsFormOpen(false);
                }}
                className="px-8 py-3.5 bg-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      <div className="relative max-w-xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Pesquisar entre os nomes..."
          className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-card-light dark:bg-card-dark border-none shadow-xl focus:outline-none focus:ring-4 focus:ring-accent/10 text-heading text-lg font-bold placeholder:font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Dictionary only simple ad banner as requested: ("Dicionário → Só banner pequeno") */}
      <ThemeBanner type="small" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.name} 
            onClick={() => onSelectItem(item)}
            className="flex bg-card-light dark:bg-card-dark p-6 rounded-[2rem] border border-border-light dark:border-border-dark items-center gap-6 hover:shadow-2xl hover:border-accent hover:-translate-y-1 transition-all cursor-pointer group shadow-sm relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-[1.2rem] bg-secondary text-accent flex items-center justify-center font-black text-2xl shrink-0 group-hover:rotate-12 transition-all shadow-lg">
              {item.name[0]}
            </div>
            <div className="flex-grow pr-16">
              <h4 className="font-black text-heading text-xl leading-none mb-1.5 group-hover:text-primary transition-colors">{item.name}</h4>
              <p className="text-xs text-accent font-black uppercase tracking-widest break-words whitespace-normal leading-relaxed">{item.meaning}</p>
            </div>
            {isAdmin && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingName(item.name);
                    setNewName(item.name || "");
                    setNewMeaning(item.meaning || "");
                    setNewDesc(item.description || "");
                    setNewBibleVerse(item.bibleVerse || "");
                    setNewContent(item.content || "");
                    setIsFormOpen(true);
                  }}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-slate-500/10 rounded-xl transition-all"
                  title="Editar nome"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => handleDeleteName(item.name, e)}
                  className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Excluir nome"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Stories({ 
  onSelectItem, 
  stories, 
  setStories, 
  isAdmin,
  triggerConfirm
}: { 
  onSelectItem: (item: any) => void;
  stories: any[];
  setStories: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"character" | "place">("character");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newBibleVerse, setNewBibleVerse] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary || !newContent) {
      alert("Por favor, preencha todos os campos da história.");
      return;
    }

    if (editingId) {
      setStories(prev => prev.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            title: newTitle,
            type: newType,
            summary: newSummary,
            content: newContent,
            bibleVerse: newBibleVerse
          };
        }
        return s;
      }));

      // Hit Supabase API via backend
      fetch("/api/db/historias/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title: newTitle,
          type: newType,
          summary: newSummary,
          content: newContent,
          referencia_biblica: newBibleVerse
        })
      }).catch(err => console.warn("Erro ao salvar história via API:", err));

      setEditingId(null);
      alert("Matéria atualizada com sucesso!");
    } else {
      const newId = "story_" + Date.now();
      const storyItem = {
        id: newId,
        title: newTitle,
        type: newType,
        summary: newSummary,
        content: newContent,
        bibleVerse: newBibleVerse
      };
      setStories(prev => [storyItem, ...prev]);

      // Hit Supabase API via backend
      fetch("/api/db/historias/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          title: newTitle,
          type: newType,
          summary: newSummary,
          content: newContent,
          referencia_biblica: newBibleVerse
        })
      }).catch(err => console.warn("Erro ao adicionar história via API:", err));

      alert("Biografia/Geografia adicionada com sucesso!");
    }

    setNewTitle("");
    setNewSummary("");
    setNewContent("");
    setNewBibleVerse("");
    setIsFormOpen(false);
  };

  const handleDeleteStory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerConfirm(
      "Confirmar Exclusão",
      "Você deseja realmente deletar permanentemente esta história e dados geográficos do banco de dados?",
      () => {
        setStories(prev => prev.filter(s => s.id !== id));

        // Track the deleted ID in local list to avoid re-pulling during synchronization
        const deleted = JSON.parse(localStorage.getItem("escola_da_fe_deleted_ids") || "[]");
        if (!deleted.includes(id)) {
          deleted.push(id);
          localStorage.setItem("escola_da_fe_deleted_ids", JSON.stringify(deleted));
        }

        // Delete from Supabase via backend API
        fetch(`/api/db/historias/${id}`, {
          method: "DELETE"
        }).catch(err => console.warn("Erro ao deletar história:", err));

        if (editingId === id) {
          setEditingId(null);
          setNewTitle("");
          setNewSummary("");
          setNewContent("");
          setNewBibleVerse("");
        }
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-20"
    >
      <div className="relative bg-secondary rounded-[4rem] p-12 md:p-20 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="relative z-10 max-w-xl">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-tight">Biografias &<br/> Geografia Sagrada</h2>
          <p className="text-white/70 text-xl leading-relaxed font-medium">Entenda o contexto físico e pessoal das narrativas bíblicas para uma compreensão holística das Escrituras.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (isFormOpen && editingId) {
                setEditingId(null);
                setNewTitle("");
                setNewSummary("");
                setNewContent("");
                setNewBibleVerse("");
              }
              setIsFormOpen(!isFormOpen);
            }}
            className="px-8 py-5 bg-accent text-secondary font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 transition-all self-start md:self-center relative z-10"
          >
            {isFormOpen ? "Fechar Painel" : "Adicionar Matéria"}
          </button>
        )}
        <div className="absolute -top-10 -right-10 p-12 opacity-5 pointer-events-none rotate-12">
          <MapPin size={400} />
        </div>
      </div>

      {isFormOpen && isAdmin && (
        <form onSubmit={handleAddStory} className="p-8 bg-card-light dark:bg-card-dark rounded-3xl border border-accent/20 space-y-4 max-w-3xl">
          <h3 className="font-extrabold text-heading text-xl">
            {editingId ? "Editar Matéria em Histórias" : "Adicionar Matéria em Histórias"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nome do Personagem ou Lugar..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as "character" | "place")}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-bold"
            >
              <option value="character">Personagem (Vida Transformada)</option>
              <option value="place">Lugar Bíblico (Geografia da Fé)</option>
            </select>
          </div>
          <input
            type="text"
            value={newSummary}
            onChange={(e) => setNewSummary(e.target.value)}
            placeholder="Resumo rápido da história..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
          />
          <div className="space-y-1">
            <label className="text-xs font-black text-[#cfaf72] dark:text-amber-400 uppercase tracking-widest block">Exposição Bíblica Detalhada</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Escreva a narrativa histórica completa com aplicação edificante..."
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-3xl focus:outline-none focus:border-accent text-sm leading-relaxed"
            />
          </div>
          <input
            type="text"
            value={newBibleVerse}
            onChange={(e) => setNewBibleVerse(e.target.value)}
            placeholder="Texto Bíblico de Referência (ex: Hebreus 11:24)..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              {editingId ? "Salvar Alterações" : "Salvar História"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewTitle("");
                  setNewSummary("");
                  setNewContent("");
                  setNewBibleVerse("");
                  setIsFormOpen(false);
                }}
                className="px-8 py-3.5 bg-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      {/* Stories discreet ad banner as requested: ("Histórias → Banner discreto") */}
      <ThemeBanner type="discreet" />

      <div className="space-y-20">
        <section>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-2 h-10 bg-accent rounded-full" />
            <h3 className="text-4xl font-black text-heading tracking-tight">Vidas Transformadas</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {stories
              .filter(s => s.type === 'character')
              .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
              .map(story => (
              <div key={story.id} onClick={() => onSelectItem(story)} className="card p-0 flex flex-col sm:flex-row overflow-hidden group cursor-pointer border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all relative">
                <div className="w-full sm:w-56 bg-slate-50 dark:bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all py-12 sm:py-0">
                  <User size={64} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-10 flex flex-col justify-center flex-grow pr-16">
                  <h4 className="font-black text-heading text-2xl mb-4 group-hover:text-primary transition-colors tracking-tight">{story.title}</h4>
                  <p className="text-base text-muted leading-relaxed line-clamp-3 font-medium">{story.summary}</p>
                </div>
                {isAdmin && (
                  <div className="absolute right-6 bottom-6 flex items-center gap-1 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(story.id);
                        setNewTitle(story.title || "");
                        setNewType(story.type || "character");
                        setNewSummary(story.summary || "");
                        setNewContent(story.content || "");
                        setNewBibleVerse(story.bibleVerse || "");
                        setIsFormOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-500/10 rounded-xl transition-all"
                      title="Editar biografia"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteStory(story.id, e)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Excluir biografia"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-2 h-10 bg-indigo-500 rounded-full" />
            <h3 className="text-4xl font-black text-heading tracking-tight">Geografia da Fé</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {stories
              .filter(s => s.type === 'place')
              .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'))
              .map(story => (
              <div key={story.id} onClick={() => onSelectItem(story)} className="card p-0 flex flex-col sm:flex-row overflow-hidden group cursor-pointer border-none shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all relative">
                <div className="w-full sm:w-56 bg-indigo-50 dark:bg-indigo-950/20 flex-shrink-0 flex items-center justify-center text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-all py-12 sm:py-0">
                  <MapPin size={64} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-10 flex flex-col justify-center flex-grow pr-16 bg-slate-50/10 dark:bg-slate-900/10">
                  <h4 className="font-black text-heading text-2xl mb-4 tracking-tight">{story.title}</h4>
                  <p className="text-base text-muted leading-relaxed line-clamp-3 font-medium">{story.summary}</p>
                </div>
                {isAdmin && (
                  <div className="absolute right-6 bottom-6 flex items-center gap-1 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(story.id);
                        setNewTitle(story.title || "");
                        setNewType(story.type || "place");
                        setNewSummary(story.summary || "");
                        setNewContent(story.content || "");
                        setNewBibleVerse(story.bibleVerse || "");
                        setIsFormOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-500/10 rounded-xl transition-all"
                      title="Editar geografia"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteStory(story.id, e)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Excluir geografia"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function Theology({ 
  onSelectItem, 
  theologyTopics, 
  setTheologyTopics, 
  isAdmin,
  triggerConfirm
}: { 
  onSelectItem: (item: any) => void;
  theologyTopics: any[];
  setTheologyTopics: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTheology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newContent) {
      alert("Por favor, preencha todos os campos do módulo de teologia.");
      return;
    }

    if (editingId) {
      setTheologyTopics(prev => prev.map(t => {
        if (t.id === editingId) {
          return {
            ...t,
            title: newTitle,
            description: newDesc,
            content: newContent
          };
        }
        return t;
      }));

      // Hit Supabase API via backend
      fetch("/api/db/teologia/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          titulo: newTitle,
          resumo: newDesc,
          conteudo_completo: newContent,
          referencias_biblicas: ""
        })
      }).catch(err => console.warn("Erro ao salvar teologia via API:", err));

      setEditingId(null);
      alert("Módulo teológico atualizado com sucesso!");
    } else {
      const newId = "theology_topic_" + Date.now();
      const topicItem = {
        id: newId,
        title: newTitle,
        description: newDesc,
        category: "Teologia",
        content: newContent
      };
      setTheologyTopics(prev => [...prev, topicItem]);

      // Hit Supabase API via backend
      fetch("/api/db/teologia/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          titulo: newTitle,
          resumo: newDesc,
          conteudo_completo: newContent,
          referencias_biblicas: ""
        })
      }).catch(err => console.warn("Erro ao adicionar teologia via API:", err));

      alert("Assunto de teologia adicionado com sucesso!");
    }

    setNewTitle("");
    setNewDesc("");
    setNewContent("");
    setIsFormOpen(false);
  };

  const handleDeleteTheology = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerConfirm(
      "Confirmar Exclusão",
      "Você deseja realmente deletar permanentemente este módulo teológico do banco de dados?",
      () => {
        setTheologyTopics(prev => prev.filter(t => t.id !== id));

        // Track the deleted ID in local list to avoid re-pulling during synchronization
        const deleted = JSON.parse(localStorage.getItem("escola_da_fe_deleted_ids") || "[]");
        if (!deleted.includes(id)) {
          deleted.push(id);
          localStorage.setItem("escola_da_fe_deleted_ids", JSON.stringify(deleted));
        }

        // Delete from Supabase via backend API
        fetch(`/api/db/teologia/${id}`, {
          method: "DELETE"
        }).catch(err => console.warn("Erro ao deletar módulo de teologia:", err));

        if (editingId === id) {
          setEditingId(null);
          setNewTitle("");
          setNewDesc("");
          setNewContent("");
        }
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <h2 className="text-5xl font-black text-heading mb-6 tracking-tight">Teologia Sistemática</h2>
          <p className="text-muted text-xl leading-relaxed font-medium">As grandes doutrinas bíblicas organizadas para proporcionar uma visão panorâmica e profunda do plano de Deus.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (isFormOpen && editingId) {
                setEditingId(null);
                setNewTitle("");
                setNewDesc("");
                setNewContent("");
              }
              setIsFormOpen(!isFormOpen);
            }}
            className="px-6 py-4 bg-accent text-secondary font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 transition-all self-start md:self-center"
          >
            {isFormOpen ? "Fechar Painel" : "Adicionar Tópico"}
          </button>
        )}
      </div>

      {isFormOpen && isAdmin && (
        <form onSubmit={handleAddTheology} className="p-8 bg-card-light dark:bg-card-dark rounded-3xl border border-accent/20 space-y-4 max-w-3xl">
          <h3 className="font-extrabold text-heading text-xl">
            {editingId ? "Editar Matéria em Teologia" : "Criar Matéria em Teologia"}
          </h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título da Doutrina (ex: Angeologia)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descrição rápida da doutrina..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
            <div className="space-y-1">
              <label className="text-xs font-black text-[#cfaf72] dark:text-amber-400 uppercase tracking-widest block">Exposição Bíblica Detalhada</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Digite a tese teológica sistemática em formato Markdown ou texto corrido completo..."
                rows={6}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-4 px-5 rounded-3xl focus:outline-none focus:border-accent text-sm"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              {editingId ? "Salvar Alterações" : "Adicionar à Teologia"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setNewTitle("");
                  setNewDesc("");
                  setNewContent("");
                  setIsFormOpen(false);
                }}
                className="px-8 py-3.5 bg-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      {/* Theology small header banner as requested: ("Teologia e cursos → Banner pequeno") */}
      <ThemeBanner type="small" />

      {/* Theology modules with native ad split in between as requested: ("Teologia e cursos → Anúncios nativos entre módulos") */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...theologyTopics].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR')).map((topic, i) => (
          <div key={topic.id} onClick={() => onSelectItem(topic)} className="card group cursor-pointer border-2 border-transparent hover:border-accent flex flex-col p-6 sm:p-8 md:p-10 shadow-xl hover:-translate-y-2 transition-all relative">
            <div className="flex justify-between items-start mb-10">
              <span className="text-accent font-black text-xs bg-accent/10 px-4 py-2 rounded-2xl tracking-widest uppercase">Módulo 0{i + 1}</span>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <div className="flex items-center gap-1 animate-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(topic.id);
                        setNewTitle(topic.title || "");
                        setNewDesc(topic.description || "");
                        setNewContent(topic.content || "");
                        setIsFormOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-500/10 rounded-xl transition-all"
                      title="Editar tópico"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTheology(topic.id, e)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Excluir tópico"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                  <BookOpen size={24} />
                </div>
              </div>
            </div>
            <h4 className="text-2xl font-black text-heading mb-4 group-hover:text-primary transition-colors tracking-tight leading-tight">{topic.title}</h4>
            <p className="text-sm text-muted leading-relaxed mb-10 font-medium line-clamp-3">{topic.description}</p>
            <div className="mt-auto pt-6 border-t border-border-light dark:border-border-dark flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Exposição Completa</span>
              <ChevronRight size={18} className="text-accent group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Course({ 
  onSelectItem, 
  courseLessons, 
  setCourseLessons, 
  isAdmin,
  triggerConfirm
}: { 
  onSelectItem: (item: any) => void;
  courseLessons: any[];
  setCourseLessons: React.Dispatch<React.SetStateAction<any[]>>;
  isAdmin: boolean;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}) {
  const [newLessonNum, setNewLessonNum] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLessonNum, setEditingLessonNum] = useState<string | null>(null);

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonNum || !newTitle || !newDesc || !newContent) {
      alert("Por favor, preencha todos os campos da lição de curso.");
      return;
    }

    if (editingLessonNum) {
      setCourseLessons(prev => prev.map(l => {
        if (l.lesson === editingLessonNum) {
          return {
            ...l,
            lesson: newLessonNum,
            title: newTitle,
            description: newDesc,
            content: newContent
          };
        }
        return l;
      }));

      // If lesson number changed, delete the old row first
      if (editingLessonNum !== newLessonNum) {
        fetch(`/api/db/curso/${editingLessonNum}`, {
          method: "DELETE"
        }).catch(err => console.warn(err));
      }

      // Hit Supabase API via backend
      fetch("/api/db/curso/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "lesson_" + newLessonNum,
          lesson: newLessonNum,
          modulo_titulo: "Curso de Teologia Básica",
          numero_modulo: 1,
          titulo_licao: newTitle,
          numero_licao: parseInt(newLessonNum) || 1,
          description: newDesc,
          category: "Curso Teológico",
          conteudo: newContent,
          duracao_minutos: 15
        })
      }).catch(err => console.warn("Erro ao salvar lição via API:", err));

      setEditingLessonNum(null);
      alert("Lição atualizada com sucesso!");
    } else {
      const newLesson = {
        lesson: newLessonNum,
        title: newTitle,
        description: newDesc,
        category: "Curso Teológico",
        content: newContent
      };
      setCourseLessons(prev => [...prev, newLesson]);

      // Hit Supabase API via backend
      fetch("/api/db/curso/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "lesson_" + newLessonNum,
          lesson: newLessonNum,
          modulo_titulo: "Curso de Teologia Básica",
          numero_modulo: 1,
          titulo_licao: newTitle,
          numero_licao: parseInt(newLessonNum) || 1,
          description: newDesc,
          category: "Curso Teológico",
          conteudo: newContent,
          duracao_minutos: 15
        })
      }).catch(err => console.warn("Erro ao adicionar lição via API:", err));

      alert("Lição adicionada ao curso com sucesso!");
    }

    setNewLessonNum("");
    setNewTitle("");
    setNewDesc("");
    setNewContent("");
    setIsFormOpen(false);
  };

  const handleDeleteLesson = (lessonNum: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerConfirm(
      "Confirmar Exclusão de Lição",
      `Você deseja realmente deletar permanentemente a Lição ${lessonNum} do Curso?`,
      () => {
        setCourseLessons(prev => prev.filter(l => l.lesson !== lessonNum));

        // Track the deleted lesson in local list to avoid re-pulling during synchronization
        const deleted = JSON.parse(localStorage.getItem("escola_da_fe_deleted_ids") || "[]");
        if (!deleted.includes(lessonNum)) {
          deleted.push(lessonNum);
          localStorage.setItem("escola_da_fe_deleted_ids", JSON.stringify(deleted));
        }

        // Delete from Supabase via backend API
        fetch(`/api/db/curso/${lessonNum}`, {
          method: "DELETE"
        }).catch(err => console.warn("Erro ao deletar lição:", err));

        if (editingLessonNum === lessonNum) {
          setEditingLessonNum(null);
          setNewLessonNum("");
          setNewTitle("");
          setNewDesc("");
          setNewContent("");
        }
      }
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-16"
    >
      <div className="bg-primary rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl border-none flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-black mb-8 tracking-tighter">Escola Fundamental</h2>
          <p className="text-white/70 text-xl leading-relaxed font-medium">Um currículo desenhado para levar o cristão do estágio inicial à maturidade teológica e serviço ministerial.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              if (isFormOpen && editingLessonNum) {
                setEditingLessonNum(null);
                setNewLessonNum("");
                setNewTitle("");
                setNewDesc("");
                setNewContent("");
              }
              setIsFormOpen(!isFormOpen);
            }}
            className="px-8 py-5 bg-accent text-secondary font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 transition-all self-start md:self-center relative z-10"
          >
            {isFormOpen ? "Fechar Painel" : "Adicionar Lição"}
          </button>
        )}
        <div className="absolute -bottom-20 -right-20 p-12 opacity-10 rotate-12 pointer-events-none">
          <GraduationCap size={400} />
        </div>
      </div>

      {isFormOpen && isAdmin && (
        <form onSubmit={handleAddLesson} className="p-8 bg-card-light dark:bg-card-dark rounded-3xl border border-accent/20 space-y-4 max-w-3xl">
          <h3 className="font-extrabold text-heading text-xl">
            {editingLessonNum ? "Editar Lição do Curso" : "Criar Lição do Curso"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              value={newLessonNum}
              onChange={(e) => setNewLessonNum(e.target.value)}
              placeholder="Ex: 05, 06..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm font-bold"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Título da lição..."
              className="w-full md:col-span-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Resumo explicativo rápido..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-2xl focus:outline-none focus:border-accent text-sm"
          />
          <div className="space-y-1">
            <label className="text-xs font-black text-[#cfaf72] dark:text-amber-400 uppercase tracking-widest block">Exposição Bíblica Detalhada</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Formule a lição doutrinária do curso completa aqui..."
              rows={5}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3.5 px-5 rounded-3xl focus:outline-none focus:border-accent text-sm leading-relaxed"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              {editingLessonNum ? "Salvar Alterações" : "Adicionar ao Curso"}
            </button>
            {editingLessonNum && (
              <button
                type="button"
                onClick={() => {
                  setEditingLessonNum(null);
                  setNewLessonNum("");
                  setNewTitle("");
                  setNewDesc("");
                  setNewContent("");
                  setIsFormOpen(false);
                }}
                className="px-8 py-3.5 bg-slate-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl"
              >
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      )}

      {/* Course small header banner as requested: ("Teologia e cursos → Banner pequeno") */}
      <ThemeBanner type="small" />

      {/* Course modules with native ad injection in list view as requested: ("Teologia e cursos → Anúncios nativos entre módulos") */}
      <div className="max-w-5xl space-y-6">
        {courseLessons.map((lesson) => (
          <div key={lesson.lesson} onClick={() => onSelectItem(lesson)} className="card p-8 flex items-center gap-10 group hover:border-primary transition-all cursor-pointer border-none shadow-xl hover:-translate-y-1 relative">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-inner transition-all group-hover:rotate-6">
              {lesson.lesson}
            </div>
            <div className="flex-grow pr-16 animate-none">
              <h4 className="font-black text-heading text-2xl mb-2 group-hover:text-primary transition-colors tracking-tight">{lesson.title}</h4>
              <p className="text-base text-muted font-medium">{lesson.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 z-10">
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLessonNum(lesson.lesson);
                      setNewLessonNum(lesson.lesson || "");
                      setNewTitle(lesson.title || "");
                      setNewDesc(lesson.description || "");
                      setNewContent(lesson.content || "");
                      setIsFormOpen(true);
                    }}
                    className="p-3 bg-slate-500/10 hover:bg-slate-500/20 text-slate-400 hover:text-primary rounded-xl transition-all"
                    title="Editar lição"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteLesson(lesson.lesson, e)}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 rounded-xl transition-all"
                    title="Excluir lição"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
              <div className="hidden sm:flex w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-800 items-center justify-center text-slate-300 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all">
                <ChevronRight size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ApoiaMissao({ 
  supportDetails, 
  setSupportDetails, 
  isAdmin 
}: { 
  supportDetails: { banco: string; titular: string; conta: string; iban: string; transferencia: string };
  setSupportDetails?: React.Dispatch<React.SetStateAction<{ banco: string; titular: string; conta: string; iban: string; transferencia: string }>>;
  isAdmin?: boolean;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      alert("Para copiar, selecione o texto manualmente.");
    }
  };

  const fields = [
    { label: "Banco", value: supportDetails.banco, icon: "🏦", key: "banco" },
    { label: "Titular", value: supportDetails.titular, icon: "👤", key: "titular" },
    { label: "Nº da Conta", value: supportDetails.conta, icon: "🔢", key: "conta" },
    { label: "IBAN", value: supportDetails.iban, icon: "📄", key: "iban" },
    { label: "Transferência/Multicaixa/Express", value: supportDetails.transferencia, icon: "📱", key: "transferencia" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-4xl mx-auto space-y-12 py-6 sm:py-10"
    >
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-pink-500/10 dark:bg-pink-500/20 rounded-full flex items-center justify-center mx-auto text-pink-500 shadow-xl shadow-pink-500/10 border border-pink-500/25 animate-pulse">
          <Heart size={36} fill="currentColor" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-heading tracking-tight">Apoia a Missão</h2>
        <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
      </div>

      <div className="bg-white dark:bg-card-dark rounded-[2.5rem] border border-border-light dark:border-border-dark p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden space-y-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        {/* Admin Inline Edit Header Banner */}
        {isAdmin && (
          <div className="p-4 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🛠️</span>
              <div className="text-left">
                <p className="text-xs font-black text-heading uppercase tracking-wider">Painel Administrativo do Apoio</p>
                <p className="text-[11px] text-muted font-medium">Você pode alterar os dados bancários exibidos abaixo em tempo real.</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn(
                "px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 border",
                isEditing 
                  ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600" 
                  : "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
              )}
            >
              {isEditing ? "Ver Visualização do Usuário ✓" : "Editar Dados de Apoio ✏️"}
            </button>
          </div>
        )}

        {isEditing && isAdmin && setSupportDetails ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-dashed border-amber-500/30 space-y-6">
            <h4 className="text-sm font-black text-[#cfaf72] uppercase tracking-wider flex items-center gap-2">
              <span>✏️</span> EDITANDO MEUS DADOS PARA APOIO:
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">🏦 Nome do Banco</label>
                <input
                  type="text"
                  value={supportDetails.banco}
                  onChange={(e) => setSupportDetails(prev => ({ ...prev, banco: e.target.value }))}
                  placeholder="Ex: Banco de Fomento Angola (BFA)"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">👤 Titular da Conta</label>
                <input
                  type="text"
                  value={supportDetails.titular}
                  onChange={(e) => setSupportDetails(prev => ({ ...prev, titular: e.target.value }))}
                  placeholder="Ex: Lemos Faya de Arcanjo"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">🔢 Número da Conta</label>
                <input
                  type="text"
                  value={supportDetails.conta}
                  onChange={(e) => setSupportDetails(prev => ({ ...prev, conta: e.target.value }))}
                  placeholder="Ex: 39482930291"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">📱 Transferência/Multicaixa/Express</label>
                <input
                  type="text"
                  value={supportDetails.transferencia}
                  onChange={(e) => setSupportDetails(prev => ({ ...prev, transferencia: e.target.value }))}
                  placeholder="Ex: 936386566"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold shadow-sm"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">📄 Código IBAN</label>
                <input
                  type="text"
                  value={supportDetails.iban}
                  onChange={(e) => setSupportDetails(prev => ({ ...prev, iban: e.target.value }))}
                  placeholder="Ex: AO06.0040.0000.3948.2930.2913.3"
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 py-3 px-4 rounded-xl focus:outline-none focus:border-accent text-sm font-semibold shadow-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  alert("Alterações dos dados de apoio guardadas com sucesso!");
                }}
                className="px-6 py-3 bg-emerald-550 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Salvar Informações Bancárias
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="prose prose-slate dark:prose-invert max-w-none text-center sm:text-left space-y-6">
              <h3 className="text-xl sm:text-2xl font-black text-heading flex items-center justify-center sm:justify-start gap-3">
                <span>📢</span> Ajude a Escola da Fé a crescer
              </h3>
              
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                Se este aplicativo tem ajudado você nos estudos, aprendizado ou fortalecimento da fé, pode apoiar o projeto de forma voluntária. O seu apoio ajuda a manter melhorias, novos conteúdos e o aplicativo disponível para mais pessoas.
              </p>

              <div className="inline-flex items-center gap-3 p-4 bg-pink-500/[0.04] dark:bg-pink-500/[0.02] border border-pink-500/20 rounded-2xl text-[#cfaf72] dark:text-pink-400 font-bold text-xs sm:text-sm leading-relaxed text-left w-full">
                <span className="text-lg shrink-0">💙</span>
                <span>O apoio é opcional — todas as funcionalidades principais continuarão disponíveis para todos.</span>
              </div>
            </div>

            {/* Bank Account Grid Panel */}
            <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-border-dark">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#cfaf72] mb-4">Dados para apoio:</h4>
              
              <div className="grid grid-cols-1 gap-4">
                {fields.map((field) => (
                  <div 
                    key={field.key}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-border-light dark:border-border-dark hover:border-[#cfaf72]/30 transition-all gap-4 group/row min-w-0"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0 flex-grow">
                      <span className="text-2xl shrink-0 w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-inner">{field.icon}</span>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider block">{field.label}</span>
                        <span className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-200 select-all break-all sm:break-normal block leading-tight">{field.value || "Não informado"}</span>
                      </div>
                    </div>

                    {field.value && (
                      <button
                        onClick={() => handleCopy(field.value, field.key)}
                        className={cn(
                          "px-4 py-2.5 sm:py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 self-end sm:self-center shrink-0 border",
                          copiedField === field.key
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-border-light dark:border-border-dark hover:border-accent hover:bg-accent hover:text-secondary shadow-sm"
                        )}
                      >
                        {copiedField === field.key ? (
                          <>
                            <Check size={14} className="animate-bounce" /> Copiado!
                          </>
                        ) : (
                          <>
                            <Copy size={13} /> Copiar
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="pt-6 border-t border-slate-100 dark:border-border-dark text-center">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic font-semibold">
            Obrigado por fazer parte da Escola da Fé.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- Main App & Router Wrapper ---

function AppContent({ isDark, setIsDark }: { isDark: boolean, setIsDark: (val: boolean) => void }) {
  const location = useLocation();

  // Dynamic links and support channels
  const [socialLinks, setSocialLinks] = useState(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_socials");
      return saved ? JSON.parse(saved) : {
        whatsapp: "936386566",
        instagram: "https://instagram.com/escoladafe",
        youtube: "https://youtube.com/escoladafe",
        facebook: "https://www.facebook.com/lemosmabiala.faya/"
      };
    } catch {
      return {
        whatsapp: "936386566",
        instagram: "https://instagram.com/escoladafe",
        youtube: "https://youtube.com/escoladafe",
        facebook: "https://www.facebook.com/lemosmabiala.faya/"
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("escola_da_fe_socials", JSON.stringify(socialLinks));
  }, [socialLinks]);

  const [supportDetails, setSupportDetails] = useState(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_support_details");
      return saved ? JSON.parse(saved) : {
        banco: "Banco de Fomento Angola (BFA)",
        titular: "Lemos Faya de Arcanjo",
        conta: "39482930291",
        iban: "AO06.0040.0000.3948.2930.2913.3",
        transferencia: "936386566"
      };
    } catch {
      return {
        banco: "Banco de Fomento Angola (BFA)",
        titular: "Lemos Faya de Arcanjo",
        conta: "39482930291",
        iban: "AO06.0040.0000.3948.2930.2913.3",
        transferencia: "936386566"
      };
    }
  });

  useEffect(() => {
    localStorage.setItem("escola_da_fe_support_details", JSON.stringify(supportDetails));
  }, [supportDetails]);

  const [isPoliciesOpen, setIsPoliciesOpen] = useState(false);

  // Dynamic privacy and terms content editable by Admin
  const [privacyText, setPrivacyText] = useState(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_privacy");
      return saved || `O aplicativo Escola da Fé respeita integralmente a sua privacidade. Todas as informações de progresso de leitura, histórico de questionários, módulos concluídos, notas de lições e itens marcados como favoritos são armazenados e processados exclusivamente de forma local no armazenamento do navegador (LocalStorage) do seu próprio dispositivo.\n\nNenhum dado pessoal, informação de navegação ou dados de transações são enviados ou guardados em servidores externos de nuvem gerenciados por nós.\n\nPara apoiar financeiramente a manutenção periódica do aplicativo, tradução de novos módulos e ampliação teológica do acervo, são exibidas campanhas publicitárias de engajamento interno e ministerial sob coordenação do desenvolvedor Lemos Faya de Arcanjo.`;
    } catch {
      return `O aplicativo Escola da Fé respeita integralmente a sua privacidade. Todas as informações de progresso de leitura, histórico de questionários, módulos concluídos, notas de lições e itens marcados como favoritos são armazenados e processados exclusivamente de forma local no armazenamento do navegador (LocalStorage) do seu próprio dispositivo.\n\nNenhum dado pessoal, informação de navegação ou dados de transações são enviados ou guardados em servidores externos de nuvem gerenciados por nós.\n\nPara apoiar financeiramente a manutenção periódica do aplicativo, tradução de novos módulos e ampliação teológica do acervo, são exibidas campanhas publicitárias de engajamento interno e ministerial sob coordenação do desenvolvedor Lemos Faya de Arcanjo.`;
    }
  });

  const [termsText, setTermsText] = useState(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_terms");
      return saved || `Todo o conteúdo teológico disponibilizado no Escola da Fé — incluindo os Estudos Temáticos, Dicionário Bíblico de Termos, Módulos Teológicos de Doutrina e Lições do Curso de Introdução — é fornecido gratuitamente apenas com propósitos de aprendizado pessoal, edificação espiritual de comunidades eclesiásticas e consulta acadêmica sem fins lucrativos sob a tutela do Desenvolvedor Principal Lemos Faya de Arcanjo.\n\nÉ estritamente vedado o uso comercial dos materiais (venda, revenda de cópias físicas ou cursos pagos derivados) sob pena das sanções cabíveis decorrentes da violação de direitos autorais de produção.\n\nAs explicações teológicas baseiam-se na exegese gramático-histórica das Escrituras Sagradas, alinhando-se majoritariamente aos padrões de confissões reformadas dogmáticas clássicas.`;
    } catch {
      return `Todo o conteúdo teológico disponibilizado no Escola da Fé — incluindo os Estudos Temáticos, Dicionário Bíblico de Termos, Módulos Teológicos de Doutrina e Lições do Curso de Introdução — é fornecido gratuitamente apenas com propósitos de aprendizado pessoal, edificação espiritual de comunidades eclesiásticas e consulta acadêmica sem fins lucrativos sob a tutela do Desenvolvedor Principal Lemos Faya de Arcanjo.\n\nÉ estritamente vedado o uso comercial dos materiais (venda, revenda de cópias físicas ou cursos pagos derivados) sob pena das sanções cabíveis decorrentes da violação de direitos autorais de produção.\n\nAs explicações teológicas baseiam-se na exegese gramático-histórica das Escrituras Sagradas, alinhando-se majoritariamente aos padrões de confissões reformadas dogmáticas clássicas.`;
    }
  });

  useEffect(() => {
    localStorage.setItem("escola_da_fe_privacy", privacyText);
  }, [privacyText]);

  useEffect(() => {
    localStorage.setItem("escola_da_fe_terms", termsText);
  }, [termsText]);

  // Unified confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  const triggerConfirm = (title: string, message: string, onConfirmAction: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirmAction();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Administrative control state
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("admin_logged") === "true";
  });

  useEffect(() => {
    localStorage.setItem("admin_logged", isAdmin ? "true" : "false");
    window.dispatchEvent(new CustomEvent("admin-state-changed", { detail: isAdmin }));
  }, [isAdmin]);

  // Persistent user content lists
  const [themes, setThemes] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_themes");
      return saved ? JSON.parse(saved) : BIBLICAL_THEMES;
    } catch {
      return BIBLICAL_THEMES;
    }
  });

  const [names, setNames] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_names");
      return saved ? JSON.parse(saved) : BIBLICAL_NAMES;
    } catch {
      return BIBLICAL_NAMES;
    }
  });

  const [stories, setStories] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_stories");
      return saved ? JSON.parse(saved) : BIBLICAL_STORIES;
    } catch {
      return BIBLICAL_STORIES;
    }
  });

  const [theologyTopics, setTheologyTopics] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_theology");
      return saved ? JSON.parse(saved) : THEOLOGY_TOPICS;
    } catch {
      return THEOLOGY_TOPICS;
    }
  });

  const [courseLessons, setCourseLessons] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_course");
      return saved ? JSON.parse(saved) : BASIC_COURSE;
    } catch {
      return BASIC_COURSE;
    }
  });

  const [announcements, setAnnouncements] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("escola_da_fe_announcements");
      return saved ? JSON.parse(saved) : [
        {
          id: "anuncio_initial_1",
          title: "Bem-vindo à nova versão Escola da Fé",
          date: "20/05/2026",
          message: "Agora você pode compilar ensinos, histórias e biografia em formato Word ou PDF real! Adicione itens e baixe gratuitamente para fins pastorais e de comunhão bíblica local."
        }
      ];
    } catch {
      return [];
    }
  });

  // Sync to localStorages
  useEffect(() => {
    localStorage.setItem("escola_da_fe_themes", JSON.stringify(themes));
  }, [themes]);

  useEffect(() => {
    localStorage.setItem("escola_da_fe_names", JSON.stringify(names));
  }, [names]);

  useEffect(() => {
    localStorage.setItem("escola_da_fe_stories", JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem("escola_da_fe_theology", JSON.stringify(theologyTopics));
  }, [theologyTopics]);

  useEffect(() => {
    localStorage.setItem("escola_da_fe_course", JSON.stringify(courseLessons));
  }, [courseLessons]);

  useEffect(() => {
    localStorage.setItem("escola_da_fe_announcements", JSON.stringify(announcements));
  }, [announcements]);

  // Database Connection & Synchronization Status State
  const [dbStatus, setDbStatus] = useState<"connecting" | "online" | "offline">("connecting");
  const [supabaseConfigMissing, setSupabaseConfigMissing] = useState(false);
  const [retryDelay, setRetryDelay] = useState<number>(3000); // 3s initial reconnect interval


  // Push individual item to DB (used for offline-to-online recovery)
  const pushItemToDb = async (table: string, item: any) => {
    let dbPayload: any = null;
    if (table === "estudos") {
      dbPayload = {
        id: item.id,
        titulo: item.title,
        descricao: item.description,
        categoria: item.category || "Estudo Bíblico",
        conteudo: item.content,
        autor: item.author || "Lemos Faya de Arcanjo",
        referencia_biblica: item.bibleVerse
      };
    } else if (table === "dicionario") {
      dbPayload = {
        termo: item.name,
        significado: item.meaning,
        descricao: item.description,
        conteudo: item.content,
        referencia_biblica: item.bibleVerse
      };
    } else if (table === "historias") {
      dbPayload = {
        id: item.id,
        title: item.title,
        type: item.type,
        summary: item.summary,
        content: item.content,
        referencia_biblica: item.bibleVerse
      };
    } else if (table === "teologia") {
      dbPayload = {
        id: item.id,
        titulo: item.title,
        resumo: item.description,
        conteudo_completo: item.content,
        referencias_biblicas: item.bibleVerse
      };
    } else if (table === "curso") {
      dbPayload = {
        id: "lesson_" + item.lesson,
        lesson: item.lesson,
        modulo_titulo: "Curso de Teologia Básica",
        numero_modulo: 1,
        titulo_licao: item.title,
        numero_licao: parseInt(item.lesson) || 1,
        description: item.description,
        category: "Curso Teológico",
        conteudo: item.content,
        duracao_minutos: 15
      };
    }

    if (!dbPayload) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      try {
        await fetch(`/api/db/${table}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dbPayload),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (e) {
      console.warn("Falha ao sincronizar item offline para o Supabase (executando offline):", e);
    }
  };

  // Main Bidirectional Database Synchronization Engine
  const syncWithDatabase = async () => {
    console.log("[Supabase Sync] Iniciando verificação de sincronização...");
    try {
      setDbStatus("connecting");

      // Validar presença das variáveis de ambiente antes de qualquer requisição
      const configExists = await checkSupabaseConfigExists();
      if (!configExists) {
        console.error("[Supabase Sync] Erro: Configuração do Supabase ausente! Nenhuma URL ou Chave foi encontrada.");
        setSupabaseConfigMissing(true);
        setDbStatus("offline");
        return;
      } else {
        setSupabaseConfigMissing(false);
      }

      let resultData: any = null;
      let syncMethod = "";

      // 1. TENTATIVA VIA PROXY EXPRESS BACKEND (Para Cloud Run / Localhost)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        console.log("[Supabase Sync] Tentando obter dados através do proxy do backend (/api/db/load)...");
        const response = await fetch("/api/db/load", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const result = await response.json();
          if (result && result.success && result.data) {
            resultData = result.data;
            syncMethod = "EXPRESS_PROXY";
            console.log("[Supabase Sync] Conectado com sucesso via backend Express.");
          }
        } else {
          console.warn(`[Supabase Sync] Retorno do proxy inválido (Status ${response.status}). Prosseguindo para fallback direto.`);
        }
      } catch (proxyErr: any) {
        console.warn(`[Supabase Sync] Falha ao conectar via Express proxy (provavelmente rodando em servidor estático como Netlify). Detalhe:`, proxyErr.message || proxyErr);
      }

      // 2. TENTATIVA DIRETA CLIENT-SIDE (Necessário para Netlify - Conecta direto do navegador)
      if (!resultData) {
        try {
          console.log("[Supabase Sync] Fazendo fallback: tentando conexão direta do navegador com o Supabase...");
          const supabase = await getSupabaseClient();
          if (supabase) {
            const safeDirectQuery = async (tableName: string) => {
              try {
                const { data, error } = await supabase.from(tableName).select("*");
                if (error) {
                  console.warn(`[Supabase Sync] Erro em consulta direta da tabela "${tableName}":`, error.message);
                  return [];
                }
                return data || [];
              } catch (e: any) {
                console.warn(`[Supabase Sync] Exceção em consulta direta da tabela "${tableName}":`, e.message || e);
                return [];
              }
            };

            const [
              estudos,
              dicionario,
              historias,
              teologia,
              curso,
              comunicados,
              configuracoes
            ] = await Promise.all([
              safeDirectQuery("estudos_basicos"),
              safeDirectQuery("dicionario_biblico"),
              safeDirectQuery("historias_biografias"),
              safeDirectQuery("teologia_doutrinas"),
              safeDirectQuery("licoes_curso"),
              safeDirectQuery("comunicados"),
              safeDirectQuery("configuracoes_sociais")
            ]);

            resultData = {
              estudos,
              dicionario,
              historias,
              teologia,
              curso,
              comunicados,
              configuracoes
            };
            syncMethod = "DIRECT_CLIENT";
            console.log("[Supabase Sync] Sincronização direta com Supabase bem-sucedida (Modo Client-Only ativo)!");
          } else {
            console.error("[Supabase Sync] Erro: Não foi possível obter instância do cliente Supabase para conexão direta.");
          }
        } catch (directErr: any) {
          console.error("[Supabase Sync] Falha geral ao carregar dados diretamente do Supabase Client:", directErr.message || directErr);
        }
      }

      if (resultData) {
        setDbStatus("online");
        setRetryDelay(3000); // Reseta retentativas em caso de sucesso
        const { estudos, dicionario, historias, teologia, curso, comunicados, configuracoes } = resultData;
        const deletedIds = JSON.parse(localStorage.getItem("escola_da_fe_deleted_ids") || "[]");

        console.log(`[Supabase Sync] Mapeando dados obtidos via ${syncMethod}. Estudos: ${estudos?.length || 0}, Dicionário: ${dicionario?.length || 0}`);

        // 1. Map Estudos (themes)
        const mappedEstudos = (estudos || []).map((row: any) => ({
          id: row.id,
          title: row.titulo,
          description: row.descricao,
          category: row.categoria || "Estudo Bíblico",
          content: row.conteudo,
          bibleVerse: row.referencia_biblica || ""
        }));
        setThemes((prev: any[]) => {
          const merged = [...mappedEstudos];
          (prev || []).forEach(localItem => {
            if (!merged.some(m => m.id === localItem.id) && !deletedIds.includes(localItem.id)) {
              merged.push(localItem);
            }
          });
          BIBLICAL_THEMES.forEach(def => {
            if (!merged.some(m => m.id === def.id) && !deletedIds.includes(def.id)) {
              merged.push(def);
            }
          });
          return merged;
        });

        // 2. Map Dicionário (names)
        const mappedDicionario = (dicionario || []).map((row: any) => ({
          name: row.termo,
          meaning: row.significado,
          description: row.descricao || "",
          content: row.conteudo || "",
          bibleVerse: row.referencia_biblica || ""
        }));
        setNames((prev: any[]) => {
          const merged = [...mappedDicionario];
          (prev || []).forEach(localItem => {
            if (!merged.some(m => m.name === localItem.name) && !deletedIds.includes(localItem.name)) {
              merged.push(localItem);
            }
          });
          BIBLICAL_NAMES.forEach(def => {
            if (!merged.some(m => m.name === def.name) && !deletedIds.includes(def.name)) {
              merged.push(def);
            }
          });
          return merged;
        });

        // 3. Map Histórias (stories)
        const mappedHistorias = (historias || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          type: row.type,
          summary: row.summary,
          content: row.content,
          bibleVerse: row.referencia_biblica || ""
        }));
        setStories((prev: any[]) => {
          const merged = [...mappedHistorias];
          (prev || []).forEach(localItem => {
            if (!merged.some(m => m.id === localItem.id) && !deletedIds.includes(localItem.id)) {
              merged.push(localItem);
            }
          });
          BIBLICAL_STORIES.forEach(def => {
            if (!merged.some(m => m.id === def.id) && !deletedIds.includes(def.id)) {
              merged.push(def);
            }
          });
          return merged;
        });

        // 4. Map Teologia (theologyTopics)
        const mappedTeologia = (teologia || []).map((row: any) => ({
          id: row.id,
          title: row.titulo,
          description: row.resumo,
          content: row.conteudo_completo,
          bibleVerse: row.referencias_biblicas || ""
        }));
        setTheologyTopics((prev: any[]) => {
          const merged = [...mappedTeologia];
          (prev || []).forEach(localItem => {
            if (!merged.some(m => m.id === localItem.id) && !deletedIds.includes(localItem.id)) {
              merged.push(localItem);
            }
          });
          THEOLOGY_TOPICS.forEach(def => {
            if (!merged.some(m => m.id === def.id) && !deletedIds.includes(def.id)) {
              merged.push(def);
            }
          });
          return merged;
        });

        // 5. Map Curso (courseLessons)
        const mappedCurso = (curso || []).map((row: any) => ({
          lesson: row.lesson,
          title: row.titulo_licao,
          description: row.description,
          category: row.category || "Curso Teológico",
          content: row.conteudo
        }));
        setCourseLessons((prev: any[]) => {
          const merged = [...mappedCurso];
          (prev || []).forEach(localItem => {
            if (!merged.some(m => m.lesson === localItem.lesson) && !deletedIds.includes(localItem.lesson)) {
              merged.push(localItem);
            }
          });
          BASIC_COURSE.forEach(def => {
            if (!merged.some(m => m.lesson === def.lesson) && !deletedIds.includes(def.lesson)) {
              merged.push(def);
            }
          });
          return merged.sort((a, b) => (parseInt(a.lesson) || 0) - (parseInt(b.lesson) || 0));
        });

        // 6. Map Comunicados (announcements)
        const mappedComunicados = (comunicados || []).map((row: any) => ({
          id: row.id,
          title: row.titulo,
          date: row.data_publicacao,
          message: row.mensagem,
          author: row.autor || "Lemos Faya de Arcanjo"
        }));
        setAnnouncements((prev: any[]) => {
          const merged = [...mappedComunicados];
          const defaults = [
            {
              id: "anuncio_initial_1",
              title: "Bem-vindo à nova versão Escola da Fé",
              date: "20/05/2026",
              message: "Agora você pode compilar ensinos, histórias e biografia em formato Word ou PDF real! Adicione itens e baixe gratuitamente para fins pastorais e de comunhão bíblica local."
            }
          ];
          defaults.forEach(def => {
            if (!merged.some(m => m.id === def.id) && !deletedIds.includes(def.id)) {
              merged.push(def);
            }
          });
          return merged;
        });

        // 7. General Configurations Mapping
        if (configuracoes && configuracoes.length > 0) {
          setSocialLinks((prev: any) => {
            const mappedSocials = { ...prev };
            configuracoes.forEach((row: any) => {
              if (row.chave === "whatsapp") mappedSocials.whatsapp = row.valor;
              else if (row.chave === "instagram") mappedSocials.instagram = row.valor;
              else if (row.chave === "youtube") mappedSocials.youtube = row.valor;
              else if (row.chave === "facebook") mappedSocials.facebook = row.valor;
            });
            return mappedSocials;
          });

          setSupportDetails((prev: any) => {
            const mappedSupport = { ...prev };
            configuracoes.forEach((row: any) => {
              if (row.chave === "support_banco") mappedSupport.banco = row.valor;
              else if (row.chave === "support_titular") mappedSupport.titular = row.valor;
              else if (row.chave === "support_conta") mappedSupport.conta = row.valor;
              else if (row.chave === "support_transferencia") mappedSupport.transferencia = row.valor;
              else if (row.chave === "support_iban") mappedSupport.iban = row.valor;
            });
            return mappedSupport;
          });

          configuracoes.forEach((row: any) => {
            if (row.chave === "privacy_text") setPrivacyText(row.valor);
            else if (row.chave === "terms_text") setTermsText(row.valor);
          });
        }

        // === UPWARD OFFLINE SYNC ===
        // Push newly created local data items which are not in DB, back to Supabase
        
        // Estudos fallback push
        themes.forEach((localItem: any) => {
          if (localItem.id && localItem.id.startsWith("estudo_") && !deletedIds.includes(localItem.id)) {
            if (!estudos.some((r: any) => r.id === localItem.id)) {
              pushItemToDb("estudos", localItem);
            }
          }
        });

        // Dicionario fallback push
        names.forEach((localItem: any) => {
          const isDefault = BIBLICAL_NAMES.some(def => def.name === localItem.name);
          if (!isDefault && !deletedIds.includes(localItem.name)) {
            if (!dicionario.some((r: any) => r.termo === localItem.name)) {
              pushItemToDb("dicionario", localItem);
            }
          }
        });

        // Historias fallback push
        stories.forEach((localItem: any) => {
          const isDefault = BIBLICAL_STORIES.some(def => def.id === localItem.id);
          if (!isDefault && !deletedIds.includes(localItem.id)) {
            if (!historias.some((r: any) => r.id === localItem.id)) {
              pushItemToDb("historias", localItem);
            }
          }
        });

        // Teologia fallback push
        theologyTopics.forEach((localItem: any) => {
          const isDefault = THEOLOGY_TOPICS.some(def => def.id === localItem.id);
          if (!isDefault && !deletedIds.includes(localItem.id)) {
            if (!teologia.some((r: any) => r.id === localItem.id)) {
              pushItemToDb("teologia", localItem);
            }
          }
        });

        // Curso fallback push
        courseLessons.forEach((localItem: any) => {
          const isDefault = BASIC_COURSE.some(def => def.lesson === localItem.lesson);
          if (!isDefault && !deletedIds.includes(localItem.lesson)) {
            if (!curso.some((r: any) => r.lesson === localItem.lesson)) {
              pushItemToDb("curso", localItem);
            }
          }
        });

      } else {
        console.warn("[Supabase Sync] Não foi possível encontrar dados válidos nas fontes disponíveis.");
        setDbStatus("offline");
      }
    } catch (error: any) {
      console.error("[Supabase Sync] Erro fatal durante a sincronização:", error.message || error);
      setDbStatus("offline");
    }
  };

  // 1. Initial sync & periodic syncing loop (runs every 60s)
  useEffect(() => {
    syncWithDatabase();

    const handleOnline = () => {
      console.log("[Supabase Sync] Evento de rede ONLINE detectado. Forçando ressincronização imediata...");
      setRetryDelay(3000); // Reseta retentativas
      syncWithDatabase();
    };

    const intervalId = setInterval(() => {
      console.log("[Supabase Sync] Sincronização periódica iniciada...");
      syncWithDatabase();
    }, 60000);

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
      clearInterval(intervalId);
    };
  }, []);

  // 2. Automated connection self-healing retry engine (3s, 5s, 10s)
  useEffect(() => {
    let timeoutId: any = null;
    
    if (dbStatus === "offline" && !supabaseConfigMissing) {
      console.log(`[Supabase Reconexão] Tentando reconectar e ressincronizar automaticamente em ${retryDelay / 1000}s...`);
      timeoutId = setTimeout(() => {
        syncWithDatabase();
        
        // Aplica incremento nas retentativas: 3s -> 5s -> 10s -> mantém 10s
        setRetryDelay(prev => {
          if (prev === 3000) return 5000;
          if (prev === 5000) return 10000;
          return 10000;
        });
      }, retryDelay);
    } else if (dbStatus === "online") {
      // Reseta para 3 segundos se estiver totalmente conectado
      setRetryDelay(3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dbStatus, retryDelay, supabaseConfigMissing]);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completed_studies');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Ads state limits
  const [studyClickCount, setStudyClickCount] = useState(0);

  // Interstitial Ad overlays
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingInterstitialItem, setPendingInterstitialItem] = useState<any>(null);

  // Rewarded optional video overlays
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [pendingRewardedItem, setPendingRewardedItem] = useState<any>(null);

  // Occasional ad on completing stories
  const [showOccasionalCompletedAd, setShowOccasionalCompletedAd] = useState(false);

  const handleSelectItem = (item: any) => {
    // Check if the opened content is an advanced theological study or course lesson ("Vídeo opcional antes de conteúdos mais longos")
    const isTeologiaOrCourseItem = item.id && (
      item.id === "bibliologia" || 
      item.id === "teontologia" || 
      item.id === "cristologia" || 
      item.id === "pneumatologia" || 
      item.id === "antropologia" || 
      item.id === "soteriologia" || 
      item.id === "escatologia" ||
      item.lesson !== undefined
    );

    const isDictionary = location.pathname === "/dicionario";

    if (isTeologiaOrCourseItem) {
      setPendingRewardedItem(item);
      setShowRewardedAd(true);
      return;
    }

    if (isDictionary) {
      // Direct open without counting or popup ads to keep dictionary search fast & pleasant
      setSelectedItem(item);
      return;
    }

    // Studies counting trigger ("Anúncio entre páginas apenas depois de abrir vários estudos, não a cada toque")
    const isStudy = location.pathname === "/estudos" || item.id?.startsWith("estudo") || BIBLICAL_THEMES.some(t => t.id === item.id);
    if (isStudy) {
      const nextCount = studyClickCount + 1;
      setStudyClickCount(nextCount);
      // Trigger interstitial ad once every 3 study taps
      if (nextCount > 0 && nextCount % 3 === 0) {
        setPendingInterstitialItem(item);
        setShowInterstitial(true);
        return;
      }
    }

    setSelectedItem(item);
  };

  const handleCompleteItem = (item: any) => {
    const itemId = item.id || item.name || item.lesson;
    if (!itemId) return;

    setCompletedIds(prev => {
      const isAlready = prev.includes(itemId);
      if (isAlready) return prev;
      const next = [...prev, itemId];
      localStorage.setItem('completed_studies', JSON.stringify(next));
      return next;
    });

    // Stories completed check: "Histórias → terminar história → anúncio ocasional"
    if (item.type === 'character' || item.type === 'place') {
      setSelectedItem(null); // Close active reading view
      setShowOccasionalCompletedAd(true); // Trigger interstitial ad after completing story on close!
    } else {
      alert("✓ Progresso teológico salvo e registrado!");
    }
  };

  const isItemCompleted = (item: any) => {
    if (!item) return false;
    const itemId = item.id || item.name || item.lesson;
    return completedIds.includes(itemId);
  };

  const formatWhatsAppLink = (val: string) => {
    if (!val) return "#";
    const clean = val.replace(/\s+/g, "");
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    const digits = clean.replace(/\D/g, "");
    if (digits.length === 9) {
      return `https://wa.me/244${digits}`;
    }
    return `https://wa.me/${digits}`;
  };

  const formatSocialLink = (val: string, platform: string) => {
    if (!val) return "#";
    const clean = val.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    if (platform === "facebook") {
      return `https://facebook.com/${clean}`;
    }
    if (platform === "instagram") {
      return `https://instagram.com/${clean}`;
    }
    if (platform === "youtube") {
      return `https://youtube.com/${clean}`;
    }
    return clean;
  };

  return (
    <div className="min-h-screen bg-bg-page dark:bg-bg-dark transition-colors duration-500 selection:bg-accent/30 flex flex-col justify-between">
      <div className="w-full flex-grow">
        <Navbar isDark={isDark} toggleDark={() => setIsDark(!isDark)} isAdmin={isAdmin} setIsAdmin={setIsAdmin} dbStatus={dbStatus} onSync={syncWithDatabase} supabaseConfigMissing={supabaseConfigMissing} />
        <main className="pt-28 p-4 sm:p-8 lg:p-12 pb-28 max-w-[1920px] mx-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home onSelectItem={handleSelectItem} announcements={announcements} setAnnouncements={setAnnouncements} isAdmin={isAdmin} triggerConfirm={triggerConfirm} socialLinks={socialLinks} setSocialLinks={setSocialLinks} privacyText={privacyText} setPrivacyText={setPrivacyText} termsText={termsText} setTermsText={setTermsText} supportDetails={supportDetails} setSupportDetails={setSupportDetails} />} />
              <Route path="/estudos" element={<Studies onSelectItem={handleSelectItem} themes={themes} setThemes={setThemes} isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/dicionario" element={<Dictionary onSelectItem={handleSelectItem} names={names} setNames={setNames} isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/historias" element={<Stories onSelectItem={handleSelectItem} stories={stories} setStories={setStories} isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/homens-deus" element={<HomensDeDeusView isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/teologia" element={<Theology onSelectItem={handleSelectItem} theologyTopics={theologyTopics} setTheologyTopics={setTheologyTopics} isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/curso" element={<Course onSelectItem={handleSelectItem} courseLessons={courseLessons} setCourseLessons={setCourseLessons} isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/comunidade" element={<Community isAdmin={isAdmin} triggerConfirm={triggerConfirm} />} />
              <Route path="/apoio" element={<ApoiaMissao supportDetails={supportDetails} setSupportDetails={setSupportDetails} isAdmin={isAdmin} />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER AD - SPECIFICALLY FOR '/' (Início) -> "Início: Banner pequeno no rodapé" */}
      {location.pathname === "/" && (
        <ThemeBanner type="footer" />
      )}

      {/* Global Dynamic Footer containing custom socialLinks editable by Admin */}
      <footer className="bg-secondary/5 dark:bg-slate-900/40 border-t border-border-light dark:border-border-dark py-12 px-6 sm:px-8 lg:px-12 mt-12 text-center lg:text-left flex flex-col xl:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <BookOpen className="text-accent" size={18} />
            <span className="font-mono text-xs font-black uppercase text-[#cfaf72] tracking-wider">Escola da Fé</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-md">
            Edificando vidas com base sólida nas Escrituras e Teologia Reformada de alta profundidade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-4 text-[10px] uppercase font-black tracking-wider">
            <span className="text-slate-400 dark:text-slate-500">
              Desenvolvido por <span className="text-[#cfaf72] hover:underline" title="Desenvolvedor Líder">Lemos Faya de Arcanjo</span>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <button 
              type="button"
              onClick={() => setIsPoliciesOpen(true)}
              className="text-slate-400 dark:text-slate-500 hover:text-accent transition-colors underline"
            >
              🛡️ Políticas de Privacidade & Termos do App
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 items-center">
          <Link to="/apoio" className="px-5 py-3.5 bg-pink-500/20 hover:bg-pink-500 hover:text-white text-pink-600 dark:text-pink-400 dark:hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider animate-pulse shadow-md">
            <Heart size={14} fill="currentColor" />
            Apoia a Missão 💙
          </Link>
          <a href={formatWhatsAppLink(socialLinks.whatsapp)} target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 dark:text-emerald-400 dark:hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <MessageCircle size={14} />
            WhatsApp Suporte
          </a>
          <a href={formatSocialLink(socialLinks.instagram, "instagram")} target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 bg-pink-500/10 hover:bg-pink-500 hover:text-white text-pink-500 dark:text-pink-400 dark:hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <Instagram size={14} />
            Instagram
          </a>
          <a href={formatSocialLink(socialLinks.youtube, "youtube")} target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 dark:text-red-400 dark:hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <Youtube size={14} />
            YouTube
          </a>
          <a href={formatSocialLink(socialLinks.facebook, "facebook")} target="_blank" rel="noopener noreferrer" className="px-5 py-3.5 bg-blue-500/10 hover:bg-blue-650 hover:text-white text-blue-500 dark:text-blue-400 dark:hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <Facebook size={14} />
            Facebook
          </a>
        </div>
      </footer>

      {/* Floating telemetry widget for interactive monetizing testing */}
      <AdMetricsPanel />

      {/* Study Detail Popup */}
      <AnimatePresence>
        {selectedItem && (
          <StudyDetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onComplete={handleCompleteItem}
            isCompleted={isItemCompleted(selectedItem)}
          />
        )}
      </AnimatePresence>

      {/* Interstitial Ad Popup after multiple studies opens */}
      <AnimatePresence>
        {showInterstitial && (
          <InterstitialAdModal 
            onClose={() => {
              setShowInterstitial(false);
              if (pendingInterstitialItem) {
                setSelectedItem(pendingInterstitialItem);
                setPendingInterstitialItem(null);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Occasional ad popup when completing storytelling objects */}
      <AnimatePresence>
        {showOccasionalCompletedAd && (
          <InterstitialAdModal 
            onClose={() => {
              setShowOccasionalCompletedAd(false);
              alert("✓ Registro de Leitura Confirmado no seu Painel Teológico de Histórias!");
            }}
          />
        )}
      </AnimatePresence>

      {/* Optional Rewarded Video Ad Modal simulator */}
      <AnimatePresence>
        {showRewardedAd && pendingRewardedItem && (
          <RewardedVideoAdSimulator 
            courseTitle={pendingRewardedItem.title || pendingRewardedItem.name || "Módulo Integrado"}
            onAdCompleted={() => {
              setShowRewardedAd(false);
              setSelectedItem(pendingRewardedItem);
              setPendingRewardedItem(null);
            }}
            onClose={() => {
              setShowRewardedAd(false);
              setPendingRewardedItem(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Unified integrated UI Dialog Modal to completely replace native confirm() */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <PoliciesModal 
        isOpen={isPoliciesOpen}
        onClose={() => setIsPoliciesOpen(false)}
        privacyText={privacyText}
        termsText={termsText}
      />

      <AITeacher />
      <PWAController />
      <LivretoManager />
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 max-w-md w-full space-y-6 text-center">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl hover:bg-red-750 hover:shadow-lg shadow-red-500/20 transition-all active:scale-95"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  privacyText: string;
  termsText: string;
}

function PoliciesModal({ isOpen, onClose, privacyText, termsText }: PoliciesModalProps) {
  const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy");
  if (!isOpen) return null;

  const renderFormattedText = (text: string) => {
    return text.split("\n\n").map((para, idx) => {
      // If paragraph contains a colon or is super short, make it stand out or style it as a sub-header
      const isHeaderLike = para.length < 50 && (para.includes(".") || para.includes(":"));
      return (
        <p key={idx} className={cn(
          "text-sm font-medium leading-relaxed",
          isHeaderLike 
            ? "text-slate-800 dark:text-slate-100 font-black text-base mt-6 tracking-tight" 
            : "text-slate-600 dark:text-slate-300"
        )}>
          {para.split("\n").map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {lIdx > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-6 sm:p-8 max-w-2xl w-full h-[85vh] sm:h-[75vh] flex flex-col justify-between space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="text-accent animate-pulse" size={20} />
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Políticas & Regulamentos</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs font-black uppercase tracking-wider">
          <button 
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "flex-1 py-3.5 rounded-lg transition-all",
              activeTab === "privacy" 
                ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            Política de Privacidade
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("terms")}
            className={cn(
              "flex-1 py-3.5 rounded-lg transition-all",
              activeTab === "terms" 
                ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            Termos de Uso
          </button>
        </div>

        {/* Dynamic content wrapper with scrolling support */}
        <div className="flex-1 overflow-y-auto pr-2 text-sm leading-relaxed space-y-4 font-medium max-h-[50vh]">
          {activeTab === "privacy" ? (
            <div className="space-y-4">
              {renderFormattedText(privacyText)}
            </div>
          ) : (
            <div className="space-y-4">
              {renderFormattedText(termsText)}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-[#cfaf72] hover:bg-neutral-800 text-secondary dark:hover:bg-accent/85 font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer shadow-md shadow-[#cfaf72]/10"
          >
            Entendido & Aceito
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <BrowserRouter>
      <AppContent isDark={isDark} setIsDark={setIsDark} />
    </BrowserRouter>
  );
}
