export interface BibleVerse {
  ref: string;
  text: string;
}

export interface DivineAttribute {
  id: string;
  name: string;
  type: "Incomunicável" | "Comunicável";
  shortDescription: string;
  longDescription: string;
  verses: BibleVerse[];
}

export const DIVINE_ATTRIBUTES: DivineAttribute[] = [
  // ==========================================
  // ATRIBUTOS ABSOLUTOS DE DEUS (INCOMUNICÁVEIS)
  // ==========================================
  {
    id: "onipotente",
    name: "Onipotente (Todo-Poderoso)",
    type: "Incomunicável",
    shortDescription: "Deus detém todo o poder soberano absoluto sobre o cosmos e a história terrestre.",
    longDescription: "A Onipotência registra a glória incomparável e o poder sem limites do Criador Supremo. Ele é capaz de executar tudo aquilo que decide, desde que condiga pura e perfeitamente com Sua perfeita essência, santa vontade e infinita sabedoria. Ele sustenta mundos por Sua simples e maravilhosa palavra de comando absoluto, derrubando exércitos de reis orgulhosos e erguendo das cinzas do vale os corações atribulados.",
    verses: [
      {
        ref: "Apocalipse 19:6",
        text: "E ouvi como que a voz de uma grande multidão, e como que a voz de muitas águas, e como que a voz de grandes trovões, que dizia: Aleluia! pois reina o Senhor nosso Deus, o Todo-Poderoso."
      },
      {
        ref: "Lucas 1:37",
        text: "Porque para Deus nada será impossível."
      }
    ]
  },
  {
    id: "onisciente",
    name: "Onisciente (Sabe todas as coisas)",
    type: "Incomunicável",
    shortDescription: "Deus detém conhecimento imediato, exaustivo, infalível e absoluto do passado, presente e futuro.",
    longDescription: "A Onisciência Divina indica que nenhuma conspiração humana, anseio sussurrado em silêncio ou dúvida do intelecto escapa dos olhos de glória do Pai. Ele conhece detalhadamente todas as possibilidades reais e contingentes do cosmos, sondando o íntimo de cada homem no leito secreto, sabendo o número exato dos cabelos da nossa cabeça e tecendo caminhos firmes.",
    verses: [
      {
        ref: "1 João 3:20",
        text: "Sabendo que, se o nosso coração nos condena, maior é Deus do que o nosso coração, e conhece todas as coisas."
      },
      {
        ref: "Salmo 139:1-4",
        text: "Senhor, tu me sondaste, e me conheces. Tu sabes o meu assentar e o meu levantar; de longe entendes o meu pensamento. Cercas o meu andar, e o meu deitar; e conheces todos os meus caminhos. Sem que haja uma palavra na minha língua, eis que, ó Senhor, tudo conheces."
      }
    ]
  },
  {
    id: "onipresente",
    name: "Onipresente (Está em todos os lugares)",
    type: "Incomunicável",
    shortDescription: "Deus preenche intimamente todo o universo e se faz presente em toda Sua plenitude ao mesmo tempo.",
    longDescription: "A Onipresença testifica que o Deus infinito não está restrito por barreiras geográficas, temporais ou físicas criadas. Em qualquer quarto trancado no meio da dor, ou na escuridão dos piores vales existenciais da terra, Ele se faz integralmente presente de joelhos sustentando e estendendo a mão protetora a todo pecador contrito que clama em oração.",
    verses: [
      {
        ref: "Salmo 139:7-10",
        text: "Para onde me irei do teu espírito, ou para onde fugirei da tua face? Se subir ao céu, lá tu estás; se fizer no inferno a minha cama, eis que tu ali estás também. Se tomar as asas da alva, se habitar nas extremidades do mar, até ali a tua mão me guiará e a tua destra me susterá."
      },
      {
        ref: "Jeremias 23:24",
        text: "Esconder-se-ia alguém em esconderijos, de modo que eu não o veja? diz o Senhor. Porventura não encho eu os céus e a terra? diz o Senhor."
      }
    ]
  },
  {
    id: "eterno",
    name: "Eterno",
    type: "Incomunicável",
    shortDescription: "Deus transcende os limites do tempo linear, não possuindo início de dias nem fim de existência.",
    longDescription: "O atributo da Eternidade indica que Deus existe acima e além das correntes passageiras do tempo linear cronológico. Para Ele, o passado, o presente e o desvelar do futuro são igualmente nítidos e simultâneos. Ele é o mesmo eterno 'Eu Sou' imutável que habita a eternidade e rege gerações terrestres.",
    verses: [
      {
        ref: "Salmo 90:2",
        text: "Antes que os montes nascessem, ou que tu formasses a terra e o mundo, sim, de eternidade a eternidade, tu és Deus."
      },
      {
        ref: "Apocalipse 1:8",
        text: "Eu sou o Alfa e o Ômega, o princípio e o fim, diz o Senhor, aquele que é, e que era, e que há de vir, o Todo-Poderoso."
      }
    ]
  },
  {
    id: "imutavel",
    name: "Imutável (Não muda)",
    type: "Incomunicável",
    shortDescription: "Deus permanece perfeitamente constante e indestrutível em Seu ser, caráter, decretos e promessas.",
    longDescription: "A Imutabilidade assinala que a essência, as alianças de graça e a justiça imaculada de Deus Pai nunca vacilam ou sofrem alteração circunstancial degenerativa. Enquanto as sociedades humanas sofrem ventos de modismos fúteis e guerras mentais, a Palavra e o caráter divino sustentam-se firmes de era em era.",
    verses: [
      {
        ref: "Tiago 1:17",
        text: "Toda a boa dádiva e todo o dom perfeito vem do alto, descendo do Pai das luzes, em quem não há mudança nem sombra de variação."
      },
      {
        ref: "Malaquias 3:6",
        text: "Porque eu, o Senhor, não mudo; por isso vós, filhos de Jacó, não sois consumidos."
      }
    ]
  },
  {
    id: "infinito",
    name: "Infinito",
    type: "Incomunicável",
    shortDescription: "Deus não conhece divisões, fim ou limitações de espaço, poder, sabedoria ou ser.",
    longDescription: "Deus é infinitamente vasto em todos os Seus dons, caráter e poder celeste. Nenhuma mente humana ou dimensões galácticas conseguem catalogar, reter ou circunscrever a extensão plena de Sua presença pura ou decretos. Sua infinitude enche todas as paragens celestes silenciosamente com incalculável glória.",
    verses: [
      {
        ref: "1 Reis 8:27",
        text: "Mas, na verdade, habitaria Deus na terra? Eis que os céus, e até o céu dos céus, não te podem conter, quanto menos esta casa que eu tenho edificado."
      },
      {
        ref: "Salmo 147:5",
        text: "Grande é o nosso Senhor, e de mudo poder; o seu entendimento é infinito."
      }
    ]
  },
  {
    id: "autoexistente",
    name: "Autoexistente (Asseidade)",
    type: "Incomunicável",
    shortDescription: "Deus possui a fonte da vida em Si mesmo, não necessitando de nada da criação física para subsistir.",
    longDescription: "Significa que Deus não depende de absolutamente nenhuma matéria, água, adoração, prece pública ou energia gerada pelo universo físico para continuar pleno em Seu ser adorável, amor e glória. Ele é plenamente autossuficiente e livre, agindo com suprema autoridade por puro amor comunitário eterno da divina Trindade.",
    verses: [
      {
        ref: "João 5:26",
        text: "Porque, como o Pai tem a vida em si mesmo, assim deu também ao Filho ter a vida em si mesmo;"
      },
      {
        ref: "Atos 17:24-25",
        text: "O Deus que fez o mundo e tudo que nele há, sendo Senhor do céu e da terra, não habita em templos feitos por mãos de homens; Nem tampouco é servido por mãos de homens, como que necessitando de alguma coisa; pois ele mesmo é quem dá a todos a vida, e a respiração, e todas as coisas;"
      }
    ]
  },
  {
    id: "soberano",
    name: "Soberano",
    type: "Incomunicável",
    shortDescription: "Deus governa soberanamente o universo, detendo a última palavra indiscutível em toda a história humana.",
    longDescription: "A Soberania atesta o reinado imaculado do Senhor sobre reinos seculares terrestres, constelações no céu e destinos do bairro. Nenhum plano malicioso ou futilidade do acaso pode obstruir, manchar ou deter Seus graciosos decretos de amor e juízo perfeito tecidos de eternidade a eternidade.",
    verses: [
      {
        ref: "Salmo 115:3",
        text: "Mas o nosso Deus está nos céus; fez tudo o que lhe agradou."
      },
      {
        ref: "Efésios 1:11",
        text: "Nele, digo, no qual também fomos feitos herança, havendo sido predestinados, conforme o propósito daquele que faz todas as coisas, segundo o conselho da sua vontade."
      }
    ]
  },
  {
    id: "independente",
    name: "Independente",
    type: "Incomunicável",
    shortDescription: "Sendo absolutamente livre, Suas escolhas, sabedoria e decretos não são influenciados por outrem.",
    longDescription: "Enquanto homens falíveis dependem de opiniões, climas políticos e fontes de recursos limitadas das nações, Deus age com total independência, provendo sabedoria soberana sem necessitar de assessores ou aceitar conselhos de reis orgulhosos das cortes terrenas secundárias.",
    verses: [
      {
        ref: "Romanos 11:34-35",
        text: "Porque, quem conheceu a mente do Senhor? ou quem foi seu conselheiro? Ou quem lhe deu primeiro a ele, para que lhe seja recompensado?"
      },
      {
        ref: "Isaías 40:13-14",
        text: "Quem guiou o Espírito do Senhor, ou, como seu conselheiro, o ensinou? Com quem tomou conselho, para que lhe desse entendimento, e lhe ensinasse o caminho do juízo, e lhe ensinasse conhecimento, e lhe mostrasse o caminho do entendimento?"
      }
    ]
  },
  {
    id: "incomparavel",
    name: "Incomparável",
    type: "Incomunicável",
    shortDescription: "Incomparável em essência, beleza celestia, caráter puro e dignidade.",
    longDescription: "A Incomparabilidade enaltece a majestosa singularidade do Altíssimo. Não há criatura espiritual, anjo de luz ou mente brilhante neste universo físico que se compare em poder, beleza, conhecimento ou pureza à essência magnífica do Criador de todas as almas.",
    verses: [
      {
        ref: "Êxodo 15:11",
        text: "Ó Senhor, quem é como tu entre os deuses? quem é como tu glorioso em santidade, admirável em louvores, realizando maravilhas?"
      },
      {
        ref: "Isaías 40:25",
        text: "A quem, pois, me comparareis, para que eu lhe seja semelhante? diz o Santo."
      }
    ]
  },

  // ==========================================
  // ATRIBUTOS MORAIS DE DEUS (COMUNICÁVEIS)
  // ==========================================
  {
    id: "santo",
    name: "Santo",
    type: "Comunicável",
    shortDescription: "Deus é totalmente separado de qualquer mácula moral, erro ou futilidade terrena.",
    longDescription: "A Santidade é o brilho indescritível do perfeito caráter intocável de Deus. Ele é infinitamente livre e adverso à injustiça, erro, orgulho egoísta e transgressão moral, e chama carinhosamente todos os Seus servos terrenos a trilharem o caminho reto da decência diária.",
    verses: [
      {
        ref: "Isaías 6:3",
        text: "E clamavam uns para os outros, dizendo: Santo, Santo, Santo é o Senhor dos Exércitos; toda a terra está cheia da sua glória."
      },
      {
        ref: "1 Pedro 1:15-16",
        text: "Mas, como é santo aquele que vos chamou, sede vós também santos em toda a vossa maneira de viver; Porquanto está escrito: Sede santos, porque eu sou santo."
      }
    ]
  },
  {
    id: "justo",
    name: "Justo",
    type: "Comunicável",
    shortDescription: "Deus executa Seus juízos em perfeita retidão, recompensando o bem e punindo incorruptivelmente o mal.",
    longDescription: "A Justiça de Deus revela Seu compromisso absoluto e inegociável com a integridade das alianças. Ele julga com perfeita eqüidade, não aceitando subornos de homens orgulhosos das nações e derramando abundante misericórdia aos crentes humildes redimidos de coração arrependido.",
    verses: [
      {
        ref: "Salmo 119:137",
        text: "Justo és, ó Senhor, e retos são os teus juízos."
      },
      {
        ref: "Romanos 3:26",
        text: "Para demonstração da sua justiça neste tempo presente, para que ele seja justo e justificador daquele que tem fé em Jesus."
      }
    ]
  },
  {
    id: "reto",
    name: "Reto",
    type: "Comunicável",
    shortDescription: "Deus é plenamente correto, reto e sem qualquer desvio em todas as Suas vias celestes.",
    longDescription: "A Retidão assegura que Deus Pai governa o transcorrer dos tempos sem desvios, enganos ou hipocrisias morais fúteis. Tudo que procede dos decretos eternos, de Suas leis graciosas e mandamentos sagrados reflete retidão pura e cristalina.",
    verses: [
      {
        ref: "Deuteronômio 32:4",
        text: "Ele é a Rocha, cujas obras são perfeitas, porque todos os seus caminhos são juízo; Deus é a verdade, e não há nele injustiça; justo e reto é ele."
      },
      {
        ref: "Salmo 25:8",
        text: "Bom e reto é o Senhor; por isso ensinará o caminho aos pecadores."
      }
    ]
  },
  {
    id: "verdadeiro",
    name: "Verdadeiro",
    type: "Comunicável",
    shortDescription: "Deus é a essência original e imutável de onde procede toda a verdade e realidade.",
    longDescription: "Deus não pode pecar ou mentir. Tudo que Ele proclama cumpre-se à risca na história. Sendo a própria fonte da verdade e da sabedoria eterna, Suas palavras do Evangelho estabelecem o sólido trilho da realidade humana e da graça de forma imutável.",
    verses: [
      {
        ref: "João 17:3",
        text: "E a vida eterna é esta: que te conheçam, a ti só, por único Deus verdadeiro, e a Jesus Cristo, a quem enviaste."
      },
      {
        ref: "Tito 1:2",
        text: "Em esperança da vida eterna, a qual Deus, que não pode mentir, prometeu antes dos tempos dos séculos."
      }
    ]
  },
  {
    id: "fiel",
    name: "Fiel",
    type: "Comunicável",
    shortDescription: "Deus cumpre rigorosamente Suas promessas de salvação a despeito das falhas humanas.",
    longDescription: "A Fidelidade testifica que, enquanto homens escorregam no cansaço fútil diante das lutas e fraquezas do bairro, Deus permanece sendo a Rocha firme, abraçando Suas noivas e os eleitos de joelhos com imensa fidelidade de aliança inabalável.",
    verses: [
      {
        ref: "Deuteronômio 7:9",
        text: "Saberás, pois, que o Senhor teu Deus, é Deus, o Deus fiel, que guarda a aliança e a misericórdia até mil gerações aos que o amam e guardam os seus mandamentos."
      },
      {
        ref: "2 Timóteo 2:13",
        text: "Se formos infiéis, ele permanece fiel; não pode negar-se a si mesmo."
      }
    ]
  },
  {
    id: "bom",
    name: "Bom",
    type: "Comunicável",
    shortDescription: "Deus é generoso e benevolente em Si mesmo, sustentando carinhosamente a vida terrestre.",
    longDescription: "A Bondade divina estende-se ativamente por todas as planícies e vales da criação física. Através dela, Ele derrama fôlego, águas limpas, grãos férteis e luz solar diária, provendo abrigo seguro a cada ser e coração humilde que necessita de abrigo.",
    verses: [
      {
        ref: "Salmo 145:9",
        text: "O Senhor é bom para todos, e as suas misericórdias estão sobre todas as suas obras."
      },
      {
        ref: "Marcos 10:18",
        text: "E Jesus lhe disse: Por que me chamas bom? Ninguém há bom senão um, que é Deus."
      }
    ]
  },
  {
    id: "misericordioso",
    name: "Misericordioso",
    type: "Comunicável",
    shortDescription: "Deus estende Sua imensa e ativa compaixão sobre os doentes e almas arrependidas em angústia.",
    longDescription: "A Misericórdia aponta a dócil inclinação carinhosa com que o Altíssimo se inclina à miséria humana no bairro. Ele derrama o bálsamo consolador sobre corações contritos que erram, socorrendo-os em tempos oportunos e cobrindo suas falhas de unção.",
    verses: [
      {
        ref: "Salmo 86:15",
        text: "Mas tu, Senhor, és um Deus compassivo e misericordioso, tardio em irar-se e grande em beneficência e verdade."
      },
      {
        ref: "Lucas 6:36",
        text: "Sede, pois, misericordiosos, como também o vosso Pai é misericordioso."
      }
    ]
  },
  {
    id: "compassivo",
    name: "Compassivo",
    type: "Comunicável",
    shortDescription: "Deus possui profunda simpatia e afeto paternal pelas dores e aflições de Seus filhos.",
    longDescription: "A Compaixão revela a terna sensibilidade de Deus em face de nossas maiores fraquezas morais e físicas. Ele não é frio, distante ou insensível aos anseios profundos implorados em clamores sinceros e corações rasgados de angústia.",
    verses: [
      {
        ref: "Salmo 103:13",
        text: "Como um pai se compadece de seus filhos, assim o Senhor se compadece daqueles que o temem."
      },
      {
        ref: "Lamentações 3:22",
        text: "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas compadecentes compaixões não têm fim."
      }
    ]
  },
  {
    id: "amoroso",
    name: "Amoroso",
    type: "Comunicável",
    shortDescription: "Deus entrega a Si mesmo em graciosa doação amorosa eterna pelas Suas amadas criaturas.",
    longDescription: "O Amor de Deus é a mais gloriosa verdade revelada no Gólgota, onde Seu Filho derramou precioso sangue de graça para reconduzir os pecadores das trevas à Sua maravilhosa mesa comunitária. Não é afeição efêmera, mas sólida atitude protetiva eterna.",
    verses: [
      {
        ref: "1 João 4:8",
        text: "Aquele que não ama não conhece a Deus; porque Deus é amor."
      },
      {
        ref: "João 3:16",
        text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
      }
    ]
  },
  {
    id: "paciente",
    name: "Paciente",
    type: "Comunicável",
    shortDescription: "Deus tolera pacientemente e adia o justo castigo, conclamando pecadores de joelhos ao arrependimento.",
    longDescription: "A Paciência traduz a relutância divina em esmagar rapidamente os transgressores rebeldes de imediato. Ele suporta com incrível generosidade e graça as ofensas mais ultrajantes, estendendo tempos e fôlegos para que a reconciliação e restauração brote na alma.",
    verses: [
      {
        ref: "Romanos 2:4",
        text: "Ou desprezas tu as riquezas da sua benignidade, e paciência, e longanimidade, ignorando que a benignidade de Deus te leva ao arrependimento?"
      },
      {
        ref: "Salmo 103:8",
        text: "Misericordioso e piedoso é o Senhor; longânimo e grande em benignidade."
      }
    ]
  },
  {
    id: "longanimo",
    name: "Longânimo",
    type: "Comunicável",
    shortDescription: "Deus é tardio em irar-Se com as provocações humanas terrenas repetitivas e incessantes.",
    longDescription: "A Longanimidade reflete a imensa largura do coração divino. Mesmo no auge dos desvarios humanos nas praças públicas, Deus refreia Sua legítima ira cósmica absoluta, operando salvação e sustentando pontes graciosas de acesso ao Seu santuário de paz.",
    verses: [
      {
        ref: "2 Pedro 3:9",
        text: "O Senhor não retarda a sua promessa, ainda que alguns a têm por tardia; mas é longânimo para convosco, não querendo que alguns se percam, senão que todos venham a arrepender-se."
      },
      {
        ref: "Naum 1:3",
        text: "O Senhor é tardio em irar-se, mas grande em poder, e ao culpado não tem por inocente."
      }
    ]
  },
  {
    id: "perdoador",
    name: "Perdoador",
    type: "Comunicável",
    shortDescription: "Deus cancela eternamente e com enorme bondade a dívida impagável de nossos erros e culpas.",
    longDescription: "O caráter Perdoador de Deus desvela a imensa beleza de Sua bondosa reconciliação. Ele afasta de nós as nossas piores culpas morais assim como o Oriente está infinitamente distante do Ocidente, restaurando comunhão pura de graça e paz.",
    verses: [
      {
        ref: "Salmo 86:5",
        text: "Pois tu, Senhor, és bom, e pronto a perdoar, e abundante em benignidade para com todos os que te invocam."
      },
      {
        ref: "Miqueias 7:18",
        text: "Quem, ó Deus, é semelhante a ti, que perdoas a iniquidade, e passas por cima da transgressão do resto da tua herança? O Senhor não retém a sua ira para sempre, porque tem prazer na benignidade."
      }
    ]
  },
  {
    id: "gracioso",
    name: "Gracioso",
    type: "Comunicável",
    shortDescription: "Deus concede livremente favor e dons imensuráveis àqueles que nada mereceriam.",
    longDescription: "Sua Graciosidade concede herança santa de eternidade e perdão integral a pecadores destituídos de qualquer merecimento próprio. É o amor de graça agindo intensamente sobre vidas desamparadas no vale.",
    verses: [
      {
        ref: "Efésios 2:8-9",
        text: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus. Não vem das obras, para que ninguém se glorie."
      },
      {
        ref: "Joel 2:13",
        text: "E rasgai o vosso coração, e não as vossas vestes, e convertei-vos ao Senhor vosso Deus; porque ele é misericordioso, e clemente, e tardio em irar-se, e grande em benignidade."
      }
    ]
  },
  {
    id: "benevolente",
    name: "Benevolente",
    type: "Comunicável",
    shortDescription: "Deus manifesta profunda e ativa boa vontade celeste em zelar pelo sustento do ser.",
    longDescription: "A Benevolência assinala que Deus não possui intenções cruéis ou arbitrárias em relação à criação. Ele se compraz em fartar de alimentos, alegrias mansas e paz o coração dos aflitos, operando bem-estar inabalável.",
    verses: [
      {
        ref: "Salmo 145:16",
        text: "Abres a tua mão, e fartas os desejos de todos os viventes."
      },
      {
        ref: "1 Crônicas 16:34",
        text: "Louvai ao Senhor, porque ele é bom; pois a sua benignidade dura para sempre."
      }
    ]
  },
  {
    id: "integro",
    name: "Íntegro",
    type: "Comunicável",
    shortDescription: "Deus é totalmente livre de má intenção, engano, falsidade ou hipocrisia em Suas vias decorosas.",
    longDescription: "A Integridade assegura que todas as intenções da mente divina são perfeitamente limpas, transparentes e consistentes. Suas palavras e decretos não portam entrelinhas escusas ou falsidade, brilhando em altíssima confiabilidade reta.",
    verses: [
      {
        ref: "Jó 34:10",
        text: "Portanto, vós, homens de entendimento, escutai-me: longe de Deus esteja o praticar a maldade, e do Todo-Poderoso o cometer a iniquidade."
      },
      {
        ref: "Salmo 18:30",
        text: "O caminho de Deus é perfeito; a palavra do Senhor é provada; é um escudo para todos os que nele confiam."
      }
    ]
  },

  // ==========================================
  // ATRIBUTOS RELACIONAIS DE DEUS (COMUNICÁVEIS)
  // ==========================================
  {
    id: "pai",
    name: "Pai",
    type: "Comunicável",
    shortDescription: "Deus nos adota afetuosamente como Seus amados filhos em Sua família eterna de aliança.",
    longDescription: "Deus Pai revela-Se o progenitor definitivo celestial que abraça os errantes decaídos das planícies do pecado, curando de joelhos Suas dores existenciais profundas e suprindo as suas fraquezas com dócil e seguro ensinamento espiritual e amor.",
    verses: [
      {
        ref: "Romanos 8:15",
        text: "Porque não recebestes o espírito de escravidão, para outra vez estardes em temor, mas recebestes o Espírito de adoção de filhos, pelo qual clamamos: Aba, Pai."
      },
      {
        ref: "Mateus 6:9",
        text: "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome."
      }
    ]
  },
  {
    id: "conselheiro",
    name: "Conselheiro",
    type: "Comunicável",
    shortDescription: "Aquele que concede direcionamento infalível e sabedoria santa às nossas escolhas nebulosas.",
    longDescription: "Nas piores trevas de encruzilhadas ou caminhos do bairro onde as soluções das nações terrenas desmoronam frustradas, a maravilhosa Palavra divina e a suave voz do Espírito sussurram aos crentes o seguro trilho da retidão e da graça e edificação espiritual.",
    verses: [
      {
        ref: "Isaías 9:6",
        text: "Porque um menino nos nasceu, um filho se nos deu, e o principado está sobre os seus ombros, e se chamará o seu nome: Maravilhoso, Conselheiro, Deus Forte, Pai da Eternidade, Príncipe da Paz."
      },
      {
        ref: "Salmo 16:7",
        text: "Bendirei ao Senhor que me aconselha; até os meus rins me instruem nas noites de vigília."
      }
    ]
  },
  {
    id: "provedor",
    name: "Provedor (Jeová Jiré)",
    type: "Comunicável",
    shortDescription: "Aquele que supre tempestivamente e com imensa fidelidade cada necessidade física e de alma.",
    longDescription: "Ele é Aquele que abre as janelas dos céus de graça para suprir mantimentos adequados, vestes, refrigério na aflição física e remédio espiritual nos momentos de provação material, exortando-nos a descansar sob Sua soberana proteção do amanhã.",
    verses: [
      {
        ref: "Gênesis 22:14",
        text: "E chamou Abraão o nome daquele lugar: O Senhor Proverá; pelo que se diz até ao dia de hoje: No monte do Senhor se proverá."
      },
      {
        ref: "Filipenses 4:19",
        text: "O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus."
      }
    ]
  },
  {
    id: "protetor",
    name: "Protetor",
    type: "Comunicável",
    shortDescription: "Deus defende carinhosamente Suas ovelhas contra as mais nefastas ciladas físicas e espirituais.",
    longDescription: "O Deus zeloso nos cerca pela retaguarda com barreiras protetivas de anjos de paz. Ele impede que as piores flechas e assaltos morais do pecado dilacerem a caminhada dos fiéis que repousam e oram sob o esconderijo de Suas asas de glória.",
    verses: [
      {
        ref: "Salmo 121:5",
        text: "O Senhor é quem te guarda; o Senhor é a tua sombra à tua mão direita."
      },
      {
        ref: "Salmo 91:1-2",
        text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu refúgio e a minha fortaleza, o meu Deus, em quem confiarei."
      }
    ]
  },
  {
    id: "pastor",
    name: "Pastor (Jeová Raah)",
    type: "Comunicável",
    shortDescription: "Aquele que conduz as Suas ovelhas cansadas a pastos verdes e águas puras de descanso.",
    longDescription: "O Bom Pastor conhece cada ovelha pelo nome, sarando de joelhos suas feridas físicas e dores mais amargas com precioso azeite curador de paz, jamais permitindo que o lobo espiritual devorador as arranque de Suas firmes e santas mãos amorosas.",
    verses: [
      {
        ref: "Salmo 23:1",
        text: "O Senhor é o meu pastor, nada me faltará."
      },
      {
        ref: "João 10:11",
        text: "Eu sou o bom pastor; o bom pastor dá a sua vida pelas ovelhas."
      }
    ]
  },
  {
    id: "libertador",
    name: "Libertador",
    type: "Comunicável",
    shortDescription: "Aquele que resgata vidas e quebra as piores cadeias espirituais, opressões físicas e perdição.",
    longDescription: "Ele é Aquele que arrebenta grilhões de vício, escravidão mental da ansiedade e culpas antigas das trevas, abrindo com autoridade imensa as portas de solene liberdade santa para os prisioneiros desamparados testemunharem Sua graça.",
    verses: [
      {
        ref: "Salmo 18:2",
        text: "O Senhor é a minha rocha, a minha fortaleza e o meu libertador; o meu Deus, o meu rochedo, em quem me refugio; o meu escudo, a força da minha salvação, e o meu alto refúgio."
      },
      {
        ref: "2 Coríntios 1:10",
        text: "O qual nos livrou de tão grande morte, e livra; em quem esperamos que também nos livrará ainda."
      }
    ]
  },
  {
    id: "salvador",
    name: "Salvador",
    type: "Comunicável",
    shortDescription: "Aquele que resgata a alma da legítima condenação da ira santa, outorgando vida de graça.",
    longDescription: "Em Cristo Jesus, Deus efetuou um magnífico resgate do cativeiro eterno. Ele tomou a nossa pesada sentença judicial no Calvário e nos ofertou reconciliação imaculada, livrando-nos da destruição do pecado eterno de joelhos na cruz.",
    verses: [
      {
        ref: "Lucas 1:47",
        text: "E o meu espírito se alegra em Deus meu Salvador."
      },
      {
        ref: "Isaías 43:11",
        text: "Eu, eu sou o Senhor, e fora de mim não há salvador."
      }
    ]
  },
  {
    id: "consolador",
    name: "Consolador",
    type: "Comunicável",
    shortDescription: "O dócil ajudador de paz que deita carinhoso bálsamo nos momentos de aflição, luto e lágrimas.",
    longDescription: "O Deus de toda a consolação envolve Suas criaturas em um terno regaço de amor e descanso nos dias cinzas das planícies. Ele enxuga com doçura as dores que as nações não conseguem sanar, deitando bálsamos indeléveis do Espírito sobre corações enfermos.",
    verses: [
      {
        ref: "2 Coríntios 1:3-4",
        text: "Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo, o Pai das misericórdias e o Deus de toda a consolação; Que nos consola em toda a nossa tribulação, para que também possamos consolar os que estiverem em alguma tribulação, com a consolação com que nós mesmos somos consolados por Deus."
      },
      {
        ref: "João 14:16",
        text: "E eu rogarei ao Pai, e ele vos dará outro Consolador, para que fique convosco para sempre."
      }
    ]
  },
  {
    id: "refugio",
    name: "Refúgio",
    type: "Comunicável",
    shortDescription: "O porto seguro protetor para onde corremos quando abalados pelas tempestades severas da vida.",
    longDescription: "Ele é a abrigo inabalável onde as torrentes da dor física, perseguições iníquas ou ventos de desgraças não conseguem penetrar para derrubar o homem fiel. Em Seus braços, o coração angustiado encontra mansa segurança de aliança.",
    verses: [
      {
        ref: "Salmo 46:1",
        text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia."
      },
      {
        ref: "Salmo 9:9",
        text: "O Senhor será também um alto refúgio para o oprimido; um alto refúgio em tempos de angústia."
      }
    ]
  },
  {
    id: "amigo",
    name: "Amigo de Aliança",
    type: "Comunicável",
    shortDescription: "Aquele que partilha conosco secreta simpatia e sincera comunhão de compaixão diária.",
    longDescription: "Deus transcende a mera relação de soberano e súdito. Ele nos acolhe junto ao Seu próprio coração de luz como amigos achegados, revelando com íntima doçura e afeto os segredos graciosos da salvação santa e da comunhão fraterna.",
    verses: [
      {
        ref: "João 15:15",
        text: "Já não vos chamo servos, porque o servo não sabe o que faz o seu senhor; mas tenho-vos chamado amigos, porque tudo quanto ouvi de meu Pai vos tenho feito conhecer."
      },
      {
        ref: "Tiago 2:23",
        text: "E cumpriu-se a Escritura, que diz: E creu Abraão em Deus, e foi-lhe isso imputado como justiça, e foi chamado o amigo de Deus."
      }
    ]
  },

  // ==========================================
  // ATRIBUTOS DE GRANDEZA E MAJESTADE (INCOMUNICÁVEIS / TRANSF.)
  // ==========================================
  {
    id: "glorioso",
    name: "Glorioso",
    type: "Incomunicável",
    shortDescription: "Revestido de indescritível esplendor, resplendor e beleza santa incandesceste cósmica.",
    longDescription: "Sua Glória é a fulgurante manifestação exterior de Sua suma perfeição cósmica. Nenhuma treva terrena ou império iníquo pode sobressair perante o indizível brilho da majestosa presença pura de Deus, cujo calor enche galáxias inteiras de reverência.",
    verses: [
      {
        ref: "Salmo 19:1",
        text: "Os céus declaram a glória de Deus e o firmamento anuncia a obra das suas mãos."
      },
      {
        ref: "Habacuque 3:3",
        text: "A sua glória cobriu os céus, e a terra encheu-se do seu louvor."
      }
    ]
  },
  {
    id: "majestoso",
    name: "Majestoso",
    type: "Incomunicável",
    shortDescription: "A suprema dignidade real incomparável que comanda o universo físico com realeza de glória.",
    longDescription: "A Majestade Divina manifesta-se no trono de glória de onde procede toda a autoridade criadora e juízos. Sua dignidade soberana estabelece reverência, assombrando em silêncio santos e arcanjos com esplendor e beleza infragmentáveis.",
    verses: [
      {
        ref: "Salmo 93:1",
        text: "O Senhor reina; está vestido de majestade. O Senhor se revestiu e cingiu de poder; o mundo também se firmou, e não poderá vacilar."
      },
      {
        ref: "Hebreus 1:3",
        text: "O qual, sendo o resplendor da sua glória, e a expressa imagem da sua pessoa, e sustentando todas as coisas pela palavra do seu poder, havendo feito por si mesmo a purificação dos nossos pecados, assentou-se à destra da majestade nas alturas."
      }
    ]
  },
  {
    id: "exaltado",
    name: "Exaltado",
    type: "Incomunicável",
    shortDescription: "Colocado soberanamente infinitas milhas inteiras acima de qualquer império espiritual ou físico.",
    longDescription: "Sendo Altíssimo, Deus é soberanamente exaltado sobre as dinastias e os deuses mudos fúteis idealizados pelas mentes rebeldes terrenas. Ele preenche e satura tudo do alto trono e dignifica os crentes decaídos com dócil benevolência sagrada.",
    verses: [
      {
        ref: "Salmo 97:9",
        text: "Pois tu, Senhor, és o mais alto sobre toda a terra; és muito mais exaltado do que todos os deuses."
      },
      {
        ref: "Isaías 57:15",
        text: "Porque assim diz o Alto e o Sublimado, que habita na eternidade, e cujo nome é Santo: Num alto e santo lugar habito; como também com o contrito e abatido de espírito, para vivificar o espírito dos abatidos, e para vivificar o coração dos contritos."
      }
    ]
  },
  {
    id: "poderoso",
    name: "Poderoso",
    type: "Incomunicável",
    shortDescription: "O Deus vitorioso detentor da incomparável força de criação ex nihilo e amparo.",
    longDescription: "Sua força imparável governa as marés do oceano e ergue impérios de pé. Nenhuma limitação muscular ou biológica atinge Seu vigor indestrutível, cujos punhos amparam os desvalidos da terra e seguram tempestades enfurecidas.",
    verses: [
      {
        ref: "Salmo 89:8",
        text: "Ó Senhor Deus dos Exércitos, quem é poderoso como tu, Senhor, com a tua fidelidade ao redor de ti?"
      },
      {
        ref: "Jeremias 32:17",
        text: "Ah Senhor Deus! Eis que tu fizeste os céus e a terra com o teu grande poder, e com o teu braço estendido; tudo te é impossível."
      }
    ]
  },
  {
    id: "rei_dos_reis",
    name: "Rei dos Reis",
    type: "Incomunicável",
    shortDescription: "O Imperador absoluto do cosmos perante o qual toda autoridade civil secular empalidece.",
    longDescription: "Todos os reis, juízes arrogantes da terra de tempos passageiros e estruturas geopolíticas seculares terão de se prostrar em cinzas e dobrar de joelhos diante de Seu incontestável trono soberano de justiça graciosa.",
    verses: [
      {
        ref: "Apocalipse 19:16",
        text: "E no manto e na sua coxa tem escrito este nome: Rei dos reis, e Senhor dos senhores."
      },
      {
        ref: "1 Timóteo 6:15",
        text: "A qual a seu tempo mostrará o bem-aventurado, e único poderoso Senhor, Rei dos reis e Senhor dos senhores."
      }
    ]
  },
  {
    id: "senhor_dos_senhores",
    name: "Senhor dos Senhores",
    type: "Incomunicável",
    shortDescription: "A autoridade jurídica e governativa definitiva e última sobre todas as almas e espíritos.",
    longDescription: "Toda cadeia espiritual e comando de anjos ou demônios está submetida integralmente e treme diante da simples Palavra de glória do Senhor Jeová, cuja realeza é imutável de era em era.",
    verses: [
      {
        ref: "Deuteronômio 10:17",
        text: "Pois o Senhor vosso Deus é o Deus dos deuses, e o Senhor dos senhores, o Deus grande, poderoso e terrível, que não faz acepção de pessoas, nem aceita recompensas."
      },
      {
        ref: "Apocalipse 17:14",
        text: "Estes combaterão contra o Cordeiro, e o Cordeiro os vencerá, porque é o Senhor dos senhores e o Rei dos reis; vencerão também os que estão com ele, chamados, e eleitos, e fiéis."
      }
    ]
  },
  {
    id: "supremo",
    name: "Supremo",
    type: "Incomunicável",
    shortDescription: "O ápice indiscutível e incomparável da autoridade moral e cósmica celeste.",
    longDescription: "Ele subsiste na chefia universal intocável de toda a realidade do cosmos. Nada se encontra acima de Seus decretos divinos, nada O suplanta e nenhuma força consegue reverter o rumo que Sua reta e boa sabedoria decretar.",
    verses: [
      {
        ref: "Colossenses 1:18",
        text: "E ele é a cabeça do corpo, da igreja; é o princípio e o primogênito dentre os mortos, para que em tudo tenha a supremacia."
      },
      {
        ref: "Salmo 83:18",
        text: "Para que saibam que tu, a quem só pertence o nome de Senhor, és o Altíssimo sobre toda a terra."
      }
    ]
  },
  {
    id: "admiravel",
    name: "Admirável",
    type: "Comunicável",
    shortDescription: "Sua santidade e beleza despertam infinita maravilha e mansa reverência mútua na alma.",
    longDescription: "Desperta indescritível estupor lícito de satisfação e alegria celestial. Suas obras de salvação na terra, o desenho intrincado das constelações e a profundidade de Seu amor levam os crentes da terra de oração a adorá-Lo com silêncios majestosos.",
    verses: [
      {
        ref: "Isaías 9:6",
        text: "Porque um menino nos nasceu... e se chamará o seu nome: Maravilhoso, Conselheiro..."
      },
      {
        ref: "Juízes 13:18",
        text: "E o anjo do Senhor lhe disse: Por que perguntas assim pelo meu nome, visto que é maravilhoso?"
      }
    ]
  },
  {
    id: "digno_de_louvor",
    name: "Digno de Louvor",
    type: "Comunicável",
    shortDescription: "O único e digno receptor de toda adoração pura e afeição de nossas vidas.",
    longDescription: "A adoração humana pertence unicamente e soberanamente ao Deus verdadeiro. Ele é o autor imaculado da vida e deitador de bálsamos salvadores, digno de receber louvores em alto estilo de todas as raças, línguas e nações no mapa.",
    verses: [
      {
        ref: "Salmo 18:3",
        text: "Invocarei o Senhor, que é digno de louvor, e ficarei livre dos meus inimigos."
      },
      {
        ref: "Apocalipse 4:11",
        text: "Digno és, Senhor, de receber glória, e honra, e poder; porque tu criaste todas as coisas, e por tua vontade são e foram criadas."
      }
    ]
  },
  {
    id: "sabio",
    name: "Sábio",
    type: "Comunicável",
    shortDescription: "Deus coordena as melhores vias espirituais perfeitas para os melhores fins.",
    longDescription: "Sua sabedoria coordena o movimento dos planetas e as dores da vida de Seus eleitos de forma perfeita. Mesmo em meio a dores profundas difíceis nas planícies do bairro, Ele está de próprio punho tecendo o belíssimo mosaico de repouso.",
    verses: [
      {
        ref: "Romanos 16:27",
        text: "Ao único Deus sábio, seja dada glória por Jesus Cristo para todo o sempre. Amém."
      },
      {
        ref: "Salmo 104:24",
        text: "Ó Senhor, quão variadas são as tuas obras! Todas as coisas fizeste com sabedoria; a terra está cheia das tuas riquezas."
      }
    ]
  },

  // ==========================================
  // ATRIBUTOS REVELADOS NAS ESCRITURAS (INCOMUNICÁVEIS / COMUNIC.)
  // ==========================================
  {
    id: "zeloso",
    name: "Zeloso (Jeová El Qanna)",
    type: "Incomunicável",
    shortDescription: "Deus detém amor ardente por Seu povo, recusando ceder Sua glória a falsos ídolos fúteis.",
    longDescription: "O zelo divino é o amor abrasivo, possessivo e terno que o Altíssimo vota com lealdade de noivo à Sua igreja de paz. Ele não divide adoração humana com fetiches de prata, dinheiro ou desejos corruptos efêmeros das planícies ordionárias.",
    verses: [
      {
        ref: "Êxodo 34:14",
        text: "Porque não te inclinarás diante de outro deus; pois o nome do Senhor é Zeloso; ele é Deus zeloso."
      },
      {
        ref: "Deuteronômio 4:24",
        text: "Porque o Senhor teu Deus é um fogo consumidor, um Deus zeloso."
      }
    ]
  },
  {
    id: "juiz",
    name: "Juiz",
    type: "Incomunicável",
    shortDescription: "Aquele que julgará retamente e dará o veredicto definitivo sobre todas as injustiças.",
    longDescription: "Nenhuma violência cometida nas caladas da história secular ou astúcia sutil de homens iníquos passará em branco. O Justo Juiz pesará com balança incorruptível cada motivo do coração e desatará retribuição e paz eternas.",
    verses: [
      {
        ref: "Gênesis 18:25",
        text: "Longe de ti que faças tal coisa, que mates o justo com o ímpio; que o justo seja como o ímpio, longe de ti. Não faria justiça o Juiz de toda a terra?"
      },
      {
        ref: "2 Timóteo 4:8",
        text: "Desde agora, a coroa da justiça me está guardada, a qual o Senhor, justo juiz, me dará naquele dia; e não somente a mim, mas também a todos os que amarem a sua vinda."
      }
    ]
  },
  {
    id: "redentor",
    name: "Redentor",
    type: "Comunicável",
    shortDescription: "Aquele que resgata e compra a nossa inteira liberdade do cativeiro do pecado moral.",
    longDescription: "A redenção divina é a compra efetuada pelo Cordeiro sofrido no monte do Calvário. Éramos escravos endividados com a legítima lei santa, mas Ele pagou integralmente o altíssimo preço de sangue inocente para nos consagrar súditos amados.",
    verses: [
      {
        ref: "Jó 19:25",
        text: "Porque eu sei que o meu Redentor vive, e que por fim se levantará sobre a terra."
      },
      {
        ref: "Isaías 44:6",
        text: "Assim diz o Senhor, Rei de Israel, e seu Redentor, o Senhor dos Exércitos: Eu sou o primeiro, e eu sou o último, e fora de mim não há Deus."
      }
    ]
  },
  {
    id: "rocha",
    name: "Rocha",
    type: "Incomunicável",
    shortDescription: "Firmeza absoluta, estabilidade eterna e amparo protetivo perante os terremotos terrestres.",
    longDescription: "Representa a base indestrutível contra tempestades e aflições em dores. Quem estabelece a sua fé sobre as Suas leis graciosas nunca desaba diante dos flagelos de doenças do bairro, desmoronamentos sociais ou tristezas humanas.",
    verses: [
      {
        ref: "Deuteronômio 32:4",
        text: "Ele é a Rocha, cujas obras são perfeitas..."
      },
      {
        ref: "Salmo 18:2",
        text: "O Senhor é a minha rocha, a minha fortaleza e o meu libertador..."
      }
    ]
  },
  {
    id: "escudo",
    name: "Escudo",
    type: "Comunicável",
    shortDescription: "A barreira de defesa excelente que intercepta os mísseis da maldade inimiga maligna.",
    longDescription: "O Senhor cerca ativamente a vida dos fiéis erguendo barreiras imensas contra ciladas mentais da culpa ou acusações. Ele atua como baluarte impenetrável onde se repousa sob sinceros laços de paz.",
    verses: [
      {
        ref: "Salmo 3:3",
        text: "Mas tu, Senhor, és um escudo para mim, a minha glória, e o que exalta a minha cabeça."
      },
      {
        ref: "Salmo 91:4",
        text: "Ele te cobrirá com as suas penas, e debaixo das suas asas te confiarás; a sua verdade será o teu escudo e broquel."
      }
    ]
  },
  {
    id: "luz",
    name: "Luz",
    type: "Incomunicável",
    shortDescription: "Dissipa as sombras do medo, do erro conceitual e do pecado moral em Seus eleitos.",
    longDescription: "Sendo Luz Inacessível moral, Deus traz discernimento reto aos corações humanos perdidos nas encruzilhadas escuras. O Seu veredito de graça clareia a mente mansa, abrindo passos firmes de reconstrução espiritual no bairro.",
    verses: [
      {
        ref: "1 João 1:5",
        text: "E esta é a mensagem que dele ouvimos, e vos anunciamos: que Deus é luz, e não há nele treva nenhuma."
      },
      {
        ref: "Salmo 27:1",
        text: "O Senhor é a minha luz e a minha salvação; de quem terei medo? O Senhor é a força da minha vida; de quem me recearei?"
      }
    ]
  },
  {
    id: "fogo_consumidor",
    name: "Fogo Consumidor",
    type: "Incomunicável",
    shortDescription: "A pureza santa incandescente que extirpa e purifica as impurezas iníquas do cosmos.",
    longDescription: "Expressa o calor de Sua santidade que queima a palha das idolatrias podres fúteis terrenas e refina as almas fiéis nos crisóis da provação carinhosa, forjando integridade e queimando a iniquidade.",
    verses: [
      {
        ref: "Hebreus 12:29",
        text: "Porque o nosso Deus é um fogo consumidor."
      },
      {
        ref: "Deuteronômio 9:3",
        text: "Sabe, pois, hoje, que o Senhor teu Deus é o que passa diante de ti como um fogo consumidor, que os destruirá..."
      }
    ]
  },
  {
    id: "alfa_omega",
    name: "Alfa e Ômega",
    type: "Incomunicável",
    shortDescription: "O princípio supremo absoluto e o encerramento decisivo de toda a criação histórica.",
    longDescription: "Ele deu origem às paragens cósmicas terrestres ex nihilo no princípio, e Ele trará a justa e apoteótica consolidação da nova Sião eterna de paz ao final da história terrena real, fechando o enredo com vitória santa.",
    verses: [
      {
        ref: "Apocalipse 1:8",
        text: "Eu sou o Alfa e o Ômega, o princípio e o fim, diz o Senhor..."
      },
      {
        ref: "Apocalipse 22:13",
        text: "Eu sou o Alfa e o Ômega, o primeiro e o derradeiro, o princípio e o fim."
      }
    ]
  },
  {
    id: "principe_da_paz",
    name: "Príncipe da Paz",
    type: "Comunicável",
    shortDescription: "Aquele que constrói e derrama mútua estabilidade espiritual e repouso da alma.",
    longDescription: "Aquele cujo reinado na cruz quebrou a inimizade moral entre criaturas errantes e o Juiz Justo, plantando amor nos bairros, confortando corações atribulados com harmonia mútua e calando a futilidade da angústia.",
    verses: [
      {
        ref: "Isaías 9:6",
        text: "Porque um menino nos nasceu... Príncipe da Paz."
      },
      {
        ref: "Efésios 2:14",
        text: "Porque ele é a nossa paz, o qual de ambos os povos fez um; e, derribando a parede de separação que estava no meio..."
      }
    ]
  },
  {
    id: "deus_forte",
    name: "Deus Forte",
    type: "Incomunicável",
    shortDescription: "O herói campeão celeste invencível que derrota o império da morte moral e das trevas.",
    longDescription: "Nas lutas onde a força das nações seculares mostra-se débil impotente, Ele ergue as mangas santas de poder vencendo o império da mentira, estendendo escudo consolador e salvando necessitados do calabouço.",
    verses: [
      {
        ref: "Isaías 9:6",
        text: "...Deus Forte..."
      },
      {
        ref: "Salmo 24:8",
        text: "Quem é este Rei da Glória? O Senhor forte e poderoso, o Senhor poderoso na batalha."
      }
    ]
  },
  {
    id: "senhor_dos_exercitos",
    name: "Senhor dos Exércitos",
    type: "Incomunicável",
    shortDescription: "O comandante altíssimo das milícias de anjos de glória e das constelações espaciais.",
    longDescription: "Jeová Sabaoth rege as paragens cósmicas e exércitos celestes de paz. Ele coordena cada elemento sem jamais cometer deslizes inexplicáveis ordinários, cercando de guarda sutil os doentes fiéis e minorias de prece.",
    verses: [
      {
        ref: "Salmo 24:10",
        text: "Quem é este Rei da Glória? O Senhor dos Exércitos, ele é o Rei da Glória."
      },
      {
        ref: "Isaías 1:9",
        text: "Se o Senhor dos Exércitos nos não deixara algum remanescente, já como Sodoma seríamos..."
      }
    ]
  },
  {
    id: "criador",
    name: "Criador",
    type: "Incomunicável",
    shortDescription: "O arquitecto genial que por Sua Palavra deu forma e existência ao universo.",
    longDescription: "Sua estupenda autoridade transformou o nada absoluto em poeira estelar, oceanos, matas verdejantes e mentes humanas pensantes. Tudo respira sob glória d'Ele, originado na infinita perícia técnica criativa de Suas mãos.",
    verses: [
      {
        ref: "Gênesis 1:1",
        text: "No princípio criou Deus os céus e a terra."
      },
      {
        ref: "Isaías 40:28",
        text: "Não sabes, não ouviste que o eterno Deus, o Senhor, o Criador dos fins da terra, não se cansa nem se fatiga? É insondável o seu entendimento."
      }
    ]
  },
  {
    id: "sustentador",
    name: "Sustentador",
    type: "Incomunicável",
    shortDescription: "Deus preserva carinhosamente ativo cada átomo do cosmos cósmico de joelhos.",
    longDescription: "Se Ele retirasse Sua grata atenção ou fôlego ativo por uma fração minúscula de segundo, o universo desabaria em total caos desértico. Mas Ele apoia as órbitas terrestres com cuidado paterno inexprimível de graça.",
    verses: [
      {
        ref: "Hebreus 1:3",
        text: "...e sustentando todas as coisas pela palavra do seu poder, havendo feito por si mesmo a purificação dos nossos pecados..."
      },
      {
        ref: "Colossenses 1:17",
        text: "E ele é antes de todas as coisas, e todas as coisas subsistem por ele."
      }
    ]
  },
  {
    id: "governador_universo",
    name: "Governador do Universo",
    type: "Incomunicável",
    shortDescription: "O administrador indiscutível cujas sábias leis regem tempos e corações.",
    longDescription: "Do alto trono de sol e luz, Ele gere as chuvas, as sementes, as erupções galácticas e as decisões de tribunais terrenos mundanos secundários com perfeito balanço moral e inteligência soberana incomparável.",
    verses: [
      {
        ref: "Salmo 103:19",
        text: "O Senhor tem estabelecido o seu trono nos céus, e o seu reino domina sobre tudo."
      },
      {
        ref: "Daniel 4:35",
        text: "E todos os moradores da terra são reputados em nada; e segundo a sua vontade ele opera com o exército do céu e os moradores da terra; não há quem possa estorvar a sua mão..."
      }
    ]
  },
  {
    id: "deus_de_paz",
    name: "Deus de Paz",
    type: "Comunicável",
    shortDescription: "A fonte original de inteira estabilidade, harmonia íntima e tranquilidade mental.",
    longDescription: "Deita quietude inefável sobre o barulho e a futilidade da agitação terrena. Ele acalma as turbulências da nossa mente necessitada nas planícies, plantando paz comunitária que excede todo o entendimento terreno humano.",
    verses: [
      {
        ref: "Filipenses 4:9",
        text: "O que também aprendestes, e recebestes, e ouvistes, e vistes em mim, isso fazei; e o Deus de paz será convosco."
      },
      {
        ref: "1 Tessalonicenses 5:23",
        text: "E o mesmo Deus de paz vos santifique em tudo; e todo o vosso espírito, e alma, e corpo, sejam conservados íntegros..."
      }
    ]
  },

  // ==========================================
  // OUTROS ATRIBUTOS (COMUNICÁVEIS / INCOMUNIC.)
  // ==========================================
  {
    id: "generoso",
    name: "Generoso",
    type: "Comunicável",
    shortDescription: "Deus esbanja ricas e abundantes dádivas carinhosas sem jamais cobrar com mesquinhez.",
    longDescription: "Sua esplêndida Generosidade derrama bênçãos diárias abundantes sobre as planícies e as orações dos crentes, concedendo dons em excesso espiritual a quem Lhe suplica de joelhos em paz sincera nas manhãs do bairro.",
    verses: [
      {
        ref: "Tiago 1:5",
        text: "E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e não o lança em rosto, e ser-lhe-á dada."
      },
      {
        ref: "Salmo 111:5",
        text: "Deu mantimento aos que o temem; lembrar-se-á sempre da sua aliança."
      }
    ]
  },
  {
    id: "bondoso",
    name: "Bondoso",
    type: "Comunicável",
    shortDescription: "Expressão carinhosa e doce de Sua afeição relational com os crentes fiéis no vale.",
    longDescription: "Diferente de tiranos caprichosos das ficções mundanas fúteis, a Benignidade e o agir bondoso do Senhor nutrem refrigério e dócil amparo a corações despedaçados por tristezas, tratando com incrível consideração cada pranto de joelhos.",
    verses: [
      {
        ref: "Salmo 145:17",
        text: "Justo é o Senhor em todos os seus caminhos, e santo em todas as suas obras."
      },
      {
        ref: "Efésios 2:7",
        text: "Para mostrar nos séculos vindouros as abundantes riquezas da sua graça em sua benignidade para conosco, em Cristo Jesus."
      }
    ]
  },
  {
    id: "clemente",
    name: "Clemente",
    type: "Comunicável",
    shortDescription: "Facilidade celestial em abrandar penas severas sob orações sinceras de confissão.",
    longDescription: "A Clemência do Altíssimo atenua as trágicas dores do nosso castigo moral merecido. Ele acolhe sob regaço carinhoso de oração os rebeldes que gemem sincero anseio espiritual de pureza, deitando unguento confortador de paz.",
    verses: [
      {
        ref: "Joel 2:13",
        text: "...e convertei-vos ao Senhor vosso Deus; porque ele é misericordioso, e clemente, tardio em irar-se..."
      },
      {
        ref: "Salmo 116:5",
        text: "Compassivo e justo é o Senhor; o nosso Deus é misericordioso."
      }
    ]
  },
  {
    id: "poderoso_em_obras",
    name: "Poderoso em Obras",
    type: "Incomunicável",
    shortDescription: "Prodígios palpáveis e milagres vitoriosos operados ativamente na história humana real.",
    longDescription: "As Suas obras assinalam feitos extraordinários na terra nas praças: abriu o mar Vermelho, desfez muralhas de Jericó e ressuscitou corpos mortos em sepulcros frios, testificando Sua imensurável realeza indestrutível de graça.",
    verses: [
      {
        ref: "Jeremias 32:19",
        text: "Grande em conselho, e poderoso em obras; porque os teus olhos estão abertos sobre todos os caminhos dos filhos de homens, para dar a cada um segundo os seus caminhos e segundo o fruto das suas obras."
      },
      {
        ref: "Salmo 77:14",
        text: "Tu és o Deus que fazes maravilhas; tu fizeste notório o teu poder entre os povos."
      }
    ]
  },
  {
    id: "rico_misericordia",
    name: "Rico em Misericórdia",
    type: "Comunicável",
    shortDescription: "A abundância inesgotável de Seu amor confortador sobre pecadores destituídos.",
    longDescription: "Testifica que as reservas e águas de compaixão paternal no peito divino nunca secam perante as piores misérias humanas, acolhendo e deitando remissão sincera com superabundância carinhosa.",
    verses: [
      {
        ref: "Efésios 2:4",
        text: "Mas Deus, que é rico em misericórdia, pelo seu muito amor com que nos amou."
      },
      {
        ref: "Salmo 103:11",
        text: "Pois assim como o céu está elevado acima da terra, assim é grande a sua misericórdia para com os que o temem."
      }
    ]
  },
  {
    id: "rico_graca",
    name: "Rico em Graça",
    type: "Comunicável",
    shortDescription: "O inesgotável e superabundante favor imerecido divino que cobre a multidão do pecado.",
    longDescription: "Revela que as riquezas insuperáveis da generosa graça do Trino Deus afogam as piores máculas e transgressões dos fiéis nas planícies, dando glória celestial sem nunca exigir mérito civil em troca.",
    verses: [
      {
        ref: "Efésios 1:7",
        text: "Em quem temos a redenção pelo seu sangue, a remissão das ofensas, segundo as riquezas da sua graça."
      },
      {
        ref: "Efésios 2:7",
        text: "Para mostrar nos séculos vindouros as abundantes riquezas da sua graça em sua benignidade para conosco, em Cristo Jesus."
      }
    ]
  },
  {
    id: "imparcial",
    name: "Imparcial",
    type: "Comunicável",
    shortDescription: "Deus julga e rege em perfeita isenção, ignorando a futilidade das aparências terrenas.",
    longDescription: "Sua Imparcialidade ignora posses materiais, nacionalidades geopoliticals ou status secular falso ordinário. Ele avalia e trata a cada ser humano com perfeita assepsia de preconceito moral, agindo com integral luz.",
    verses: [
      {
        ref: "Deuteronômio 10:17",
        text: "...o Deus grande, poderoso e terrível, que não faz acepção de pessoas, nem aceita recompensas."
      },
      {
        ref: "Romanos 2:11",
        text: "Porque, para com Deus, não há acepção de pessoas."
      }
    ]
  },
  {
    id: "confiavel",
    name: "Confiável",
    type: "Comunicável",
    shortDescription: "Aquele sob cujas palavras eternas e alianças de graça repousamos sem temor de falhas.",
    longDescription: "Nas piores tormentas onde as promessas das nações terrenas naufragam infrutíferas, as promessas de Deus Pai erguem-se indestrutíveis. Quem escolhe confiar sob Seu Evangelho de verdade nunca sairá envergonhado.",
    verses: [
      {
        ref: "Salmo 125:1",
        text: "Os que confiam no Senhor serão como o monte de Sião, que não se abala, mas permanece para sempre."
      },
      {
        ref: "Romanos 10:11",
        text: "Porque a Escritura diz: Todo aquele que nele crer não será confundido."
      }
    ]
  },
  {
    id: "excelente",
    name: "Excelente",
    type: "Comunicável",
    shortDescription: "Tudo o que Deus ordena, faz e expressa exibe insuperável patamar de perfeição celeste.",
    longDescription: "A Excelência Divina dita que Suas obras, leis terapêuticas e desígnios morais de justiça são sumamente belos, corretos, polidos e desprovidos de falha técnica, despertando mansa satisfação cósmica mútua.",
    verses: [
      {
        ref: "Salmo 148:13",
        text: "Louvem o nome do Senhor, pois só o seu nome é excelente; a sua majestade está sobre a terra e o céu."
      },
      {
        ref: "Salmo 8:1",
        text: "Ó Senhor, Senhor nosso, quão admirável é o teu nome em toda a terra, tu que puseste a tua glória sobre os céus!"
      }
    ]
  },
  {
    id: "perfeito",
    name: "Perfeito",
    type: "Incomunicável",
    shortDescription: "Absoluta e total isenção de qualquer falta ou imperfeição técnica ou moral.",
    longDescription: "A Perfeição indica que Ele é plenamente completo, redondo, belo, imaculado e intocável por qualquer fealdade de caráter. Tudo criado por Suas mãos tem a nobre chancela de pureza santa original e excelente dignidade.",
    verses: [
      {
        ref: "Mateus 5:48",
        text: "Sede vós pois perfeitos, como é perfeito o vosso Pai que está nos céus."
      },
      {
        ref: "Salmo 18:30",
        text: "O caminho de Deus é perfeito; a palavra do Senhor é provada; é um escudo para todos os que nele confiam."
      }
    ]
  }
];
