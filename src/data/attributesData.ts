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
  {
    id: "asseidade",
    name: "Asseidade (Autoexistência)",
    type: "Incomunicável",
    shortDescription: "Deus existe por Si mesmo e não necessita de nenhuma criatura ou do universo para ser pleno.",
    longDescription: "A Asseidade ou Independência Divina é o atributo pelo qual reconhecemos que Deus é plenamente autoexistente, autosuficiente e absoluto. Ao contrário de nós, humanos, que dependemos da herança genética dos nossos pais, da água potável das chuvas, das plantações do campo e da própria atmosfera terrestre criada para cada respiração, Deus não tem necessidade de nada fora de Si mesmo.\n\nEle não criou o universo por solidão de coração ou carência afetiva, visto que a gloriosa e santa Trindade (Pai, Filho e Espírito Santo) compartilha perfeita comunhão de amor invisível eterno desde antes da fundação de todas as paragens cósmicas terrestres. Deus é a fonte perene original da própria vida em sua plenitude indestrutível, agindo com suprema soberania.",
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
    id: "eternidade",
    name: "Eternidade",
    type: "Incomunicável",
    shortDescription: "Deus não possui início, meio ou fim, governando e transcendendo totalmente a barreira cronológica humana.",
    longDescription: "O atributo da Eternidade indica que Deus transcende por completo os limites do tempo linear criado. Para o Criador, o passado, o presente e o futuro desvelam-se diante de Seus olhos de glória com clareza simultânea e permanente imediata.\n\nDeus é o 'Eu Sou' eterno que habita na eternidade e não sofre as dores crônicas do envelhecimento biológico, as fraquezas da decadência física das nossas células ou a transitoriedade fútil dos reinados humanos criados na terra de tempos passageiros. Ele é antes do tempo e sua realeza subsiste eternamente pura.",
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
    id: "imutabilidade",
    name: "Imutabilidade",
    type: "Incomunicável",
    shortDescription: "Deus é plenamente constante e indestrutível em Seu ser, caráter, decretos bem-aventurados e santidade pura.",
    longDescription: "A Imutabilidade assinala que a essência, as promessas inabaláveis, o caráter intocável e a vontade soberana absoluta de Deus Pai nunca mudam nem se corrompem sob variações circunstanciais fúteis do mundo físico.\n\nEnquanto nós vacilamos diariamente entre deprimidos, ansiosos e felizes à mercê de modismos e conflitos do bairro principal, Deus permanece perpetuamente fiel de Século em Século, sustentando de pé Suas promessas de salvação e graça operadas com perfeita e imaculada integridade no Calvário.",
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
    id: "onipresença",
    name: "Onipresença",
    type: "Incomunicável",
    shortDescription: "Deus está presente por inteiro e com toda Sua soberana autoridade espiritual em todos os pontos do universo ao mesmo tempo.",
    longDescription: "A Onipresença testifica que Deus Pai não está restrito de maneira rústica por distâncias físicas espaciais planetárias ou divisões geopolíticas terrenas. Ele preenche e satura intimamente toda a imensidão da criação de forma ativa sem expandir ou se fragmentar como substância comum corpórea.\n\nCom essa gloriosa e consoladora certeza teológica sagrada, sabemos com precisão que em qualquer quarto escuro trancado em dores no meio da madrugada, ou no fundo das piores planícies de aflições, Ele se faz integralmente presente amando, consolando de joelhos e sustentando o Seu povo com poder e graça divina.",
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
    id: "onisciência",
    name: "Onisciência",
    type: "Incomunicável",
    shortDescription: "Deus detém conhecimento imediato, exaustivo, infalível e absoluto de todas as realidades reais, ocultas e futuras.",
    longDescription: "A Onisciência Divina indica que nada passa desapercebido das retinas de glória de Deus Pai. Ele conhece perfeitamente no íntimo íntimo os mais secretos sussurros e anseios implorados em silêncio no leito com as portas cerradas, bem como sabe o número exato dos cabelos da nossa cabeça e o desenrolar inevitável das engrenagens da história.\n\nNenhuma dúvida humana, conspiração de reis orgulhosos das nações no mapa ou hipótese futura escapa de Seu veredicto eterno absoluto de conhecimento eterno.",
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
    id: "onipotência",
    name: "Onipotência",
    type: "Incomunicável",
    shortDescription: "Deus possui todo o poder supremo ilimitado e soberano para concretizar e decretar integralmente Sua reta e boa vontade.",
    longDescription: "A Onipotência registra a majestade irresistível de Deus Pai. Deus é capaz de fazer tudo e qualquer coisa que queira e determine, desde que condiga pura e perfeitamente com Seu caráter de pura verdade, imaculada santidade extrema e glorioso amor absoluto.\n\nDeus não pode pecar ou mentir pois tais leviandades fúteis violam Sua essência incorruptível santa, mas Ele ostenta plenos direitos criadores de transformar vidas decaídas nas planícies, deter tempestades enfurecidas no mar e fundar mundos por Sua simples e maravilhosa palavra de comando real.",
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
    id: "simplicidade",
    name: "Simplicidade",
    type: "Incomunicável",
    shortDescription: "Deus não é formado por partes compostas, possuindo integridade perfeita e indivisível em todos os Seus aspectos celestes.",
    longDescription: "A Simplicidade Divina é um conceito doutrinário precioso que expõe que Deus não é o resultado de uma composição mecânica de forças, partes materiais ou energias agrupadas. Ele é inteiramente essencialmente Espírito puro infragmentável e único.\n\nIsso significa que Seus atributos perfeitos (Amor, Justiça, Santidade, Sabedoria) não disputam espaço ou dividem Seu Ser em facções separadas; quando Deus Pai executa justiça sincera, Ele a opera em perfeita comunhão e simultaneidade com Seu imenso Amor eterno e Santidade absoluta, sem incoerências.",
    verses: [
      {
        ref: "João 4:24",
        text: "Deus é Espírito, e importa que os que o adoram o adorem em espírito e em verdade."
      },
      {
        ref: "1 João 1:5",
        text: "E esta é a mensagem que dele ouvimos, e vos anunciamos: que Deus é luz, e não há nele treva nenhuma."
      }
    ]
  },
  {
    id: "santidade",
    name: "Santidade",
    type: "Comunicável",
    shortDescription: "Deus é inteiramente separado de toda futilidade moral, pecado e erro, brilhando em altíssima e transcendente retidão pura.",
    longDescription: "A Santidade é o atributo que separa Deus incomensuravelmente de toda e qualquer imperfeição e dolo moral criado no cosmos. Deus é infinitamente limpo, puro, reto e avesso à injustiça e pecado.\n\nContudo, sendo um atributo comunicável divino excelente, Deus chama os Seus servos da terra de prece no bairro para trilharem a trilha santa da pureza interior, separando o coração de prazeres mundanos decaídos fúteis e buscando retidão terapêutica santa inspirada nos ensinamentos do Evangelho de Cristo.",
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
    id: "amor",
    name: "Amor",
    type: "Comunicável",
    shortDescription: "Deus entrega a Si mesmo em doação santa e pura afeição eterna, buscando zelosamente o bem de Suas amadas criaturas.",
    longDescription: "O Amor de Deus constitui a própria essência de Suas manifestações acolhedoras com os Seus adoradores. Este amor não representa uma emoção fútil comum efêmera da humanidade mundana, mas sim a mais alta entrega, cuja sublime e imaculada evidência resplandeceu na cruz do Gólgota, onde Seu Filho Jesus de Nazaré verteu Seu sangue inocente de graça para perdoar os nossos pecados.\n\nEle nos incentiva a sermos canais acolhedores desse dócil amor, socorrendo viúvas, confortando necessitados nas praças públicas e exercendo misericórdia no bairro diariamente.",
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
    id: "justica",
    name: "Justiça",
    type: "Comunicável",
    shortDescription: "Deus governa a história e pune o pecado em perfeita retidão moral, sendo incorruptível em cada veredicto e aliança.",
    longDescription: "A Justiça de Deus aponta Seu papel imaculado como o Supremo e Justo Juiz de toda a terra nas planícias. Deus nunca distorce o direito a favor de ricos orgulhosos ou comete equívocos de perversidade arbitrária.\n\nDeus pune o crime moral com rigor, mas em Cristo reconciliou perfeitamente os pecadores de joelhos, derramando sobre o Redentor a pena merecida da ira divina, demonstrando-Se Justo e Justificador do crente humilde em orações.",
    verses: [
      {
        ref: "Salmo 119:137",
        text: "Justo és, ó Senhor, e retos são os teus juízos."
      },
      {
        ref: "Romanos 3:25-26",
        text: "Ao qual Deus propôs para propiciação pela fé no seu sangue, para demonstração da sua justiça pela remissão dos pecados dantes cometidos, sob a paciência de Deus; Para demonstração da sua justiça neste tempo presente, para que ele seja justo e justificador daquele que tem fé em Jesus."
      }
    ]
  },
  {
    id: "fidelidade",
    name: "Fidelidade (Verdade)",
    type: "Comunicável",
    shortDescription: "Deus de forma alguma falha em Cumprir as Suas promessas, operando como firme esteio inabalável sob as tormentas cíclicas.",
    longDescription: "A Fidelidade ou Verdade Divina denota a total coerência existencial de Deus Pai com Suas promessas e estatutos sagrados eternos. Deus não volta atrás em Suas alianças solemnes carinhosas de graça operadas com os crentes.\n\nMesmo quando vacilamos futilmente ou escorregamos no cansaço físico em meio aos tropeços do bairro, a Sua fidelidade graciosa inegociável nos resgata, ergue do abismo cinza e reconduz com segurança eterna de volta ao caminho reto da luz e do descanso interior no santuário.",
    verses: [
      {
        ref: "Deuteronômio 7:9",
        text: "Saberás, pois, que o Senhor teu Deus, é Deus, o Deus fiel, que guarda a aliança e a misericórdia até mil gerações aos que o amam e guardam os seus mandamentos;"
      },
      {
        ref: "2 Timóteo 2:13",
        text: "Se formos infiéis, ele permanece fiel; não pode negar-se a si mesmo."
      }
    ]
  },
  {
    id: "misericordia_graca",
    name: "Misericórdia e Graça",
    type: "Comunicável",
    shortDescription: "A misericórdia socorre as aflições e misérias humanas; e a graça concede perdão e favor imerecidos e abundantes.",
    longDescription: "A Misericórdia e a Graça constituem as fontes terapêuticas pelas quais Deus Pai se aproxima voluntariamente de homens falidos. A Misericórdia aponta para a imensa compaixão paternal indestrutível de Deus, que se inclina sensível de joelhos com amor e deita bálsamos consoladores sobre as feridas morais de enfermos nos hospitais e das almas em sofrimento.\n\nA Graça representa o favor supremo divino imerecido incomparável, que confere herança incorruptível de eternidade e perdão absoluto a rebeldes pecadores que nada mereceriam senão o rigoroso e justo veredicto da condenação eterna.",
    verses: [
      {
        ref: "Êxodo 34:6",
        text: "Passando, pois, o Senhor perante ele, clamou: O Senhor, o Senhor Deus, misericordioso e piedoso, tardio em irar-se e grande em beneficência e verdade;"
      },
      {
        ref: "Efésios 2:8-9",
        text: "Porque pela graça sois salvos, por meio da fé; e isto não vem de vós, é dom de Deus. Não vem das obras, para que ninguém se glorie;"
      }
    ]
  },
  {
    id: "bondade",
    name: "Bondade",
    type: "Comunicável",
    shortDescription: "Deus é a origem intocável e o pilar absoluto de todo bem, zelando pelo sustento sutil e provisivo de Suas criaturas.",
    longDescription: "A Bondade nos informa que Deus Pai age como um Provedor zeloso amoroso que derrama alegrias e sustento nas planícies e vales da criação terrestres. Ele não opera com crueldades e caprichos tirânicos insensíveis.\n\nSua benevolência brilha no sol que brilha indiscriminadamente sobre justos e injustos no dia a dia do bairro, preenchendo as colheitas rústicas de grãos doces, as águas limpas dos rios correntes no campo e dando fôlego de vida a cada animal e alma vivente com abundância carinhosa.",
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
    id: "sabedoria",
    name: "Sabedoria",
    type: "Comunicável",
    shortDescription: "Deus coordena os melhores propósitos na história pelos melhores meios espirituais perfeitos possíveis.",
    longDescription: "A Sabedoria denota que as decisões ordenadas por Deus Pai portam retidão lógica cósmica incompreensível e perfeita de harmonia. Deus nunca erra o timing ideal de curas ou comete enganos ao conduzir as orações de Seus eleitos.\n\nMesmo quando as trilhas da nossa existência terrena parecem complexas, rochosas ou nubladas de dores crônicas agudas e tristezas na terra, a Sua eterna sabedoria celestial está de próprio punho tecendo o melhor mosaico amoroso final de paz, salvação eterna e consolo indelével no Corpo de Cristo.",
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
  }
];
