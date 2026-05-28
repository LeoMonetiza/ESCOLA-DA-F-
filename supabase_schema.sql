-- SCRIPTS SQL PARA CRIAR AS TABELAS NO SUPABASE (COLE NO SQL EDITOR DO SUPABASE)
-- Este script foi projetado para ser re-executável de forma segura sem quebrar dados existentes.

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) DEFAULT 'estudante',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE POSTAGENS (MURAL)
CREATE TABLE IF NOT EXISTS postagens (
    id VARCHAR(100) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    data_publicacao VARCHAR(50) NOT NULL,
    autor VARCHAR(100) DEFAULT 'Lemos Faya de Arcanjo',
    imagem_url TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE CONFIGURAÇÕES SOCIAIS / GERAIS
CREATE TABLE IF NOT EXISTS configuracoes_sociais (
    chave VARCHAR(50) PRIMARY KEY,
    valor TEXT NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INSERIR DADOS INICIAIS NAS CONFIGURAÇÕES SOCIAIS
INSERT INTO configuracoes_sociais (chave, valor) VALUES 
('whatsapp', '936386566'),
('instagram', 'https://instagram.com/escoladafe'),
('youtube', 'https://youtube.com/escoladafe'),
('facebook', 'https://www.facebook.com/lemosmabiala.faya/'),
('privacy_text', 'A Escola da Fé tem compromisso máximo com a privacidade de dados...'),
('terms_text', 'Ao utilizar a plataforma Escola da Fé, você concorda com...')
ON CONFLICT (chave) DO NOTHING;

-- 4. TABELA DE PROGRESSO DO ESTUDANTE
CREATE TABLE IF NOT EXISTS progresso_estudante (
    id SERIAL PRIMARY KEY,
    aluno_email VARCHAR(255) NOT NULL,
    item_id VARCHAR(100) NOT NULL,
    completado BOOLEAN DEFAULT TRUE,
    completado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(aluno_email, item_id)
);

-- 5. TABELA DE ESTUDOS TEMÁTICOS / ARTIGOS
CREATE TABLE IF NOT EXISTS estudos_basicos (
    id VARCHAR(100) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100) DEFAULT 'Estudo Bíblico',
    conteudo TEXT NOT NULL,
    autor VARCHAR(150) DEFAULT 'Lemos Faya de Arcanjo',
    referencia_biblica VARCHAR(250),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DO DICIONÁRIO BÍBLICO DE TERMOS & NOMES
CREATE TABLE IF NOT EXISTS dicionario_biblico (
    id SERIAL PRIMARY KEY,
    termo VARCHAR(150) UNIQUE NOT NULL,
    significado TEXT NOT NULL,
    descricao TEXT,
    conteudo TEXT,
    referencia_biblica VARCHAR(250)
);

-- 7. TABELA DE EXPOSIÇÕES DOUTRINÁRIAS / TEOLOGIA SISTEMÁTICA
CREATE TABLE IF NOT EXISTS teologia_doutrinas (
    id VARCHAR(100) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    resumo TEXT NOT NULL,
    referencias_biblicas TEXT,
    conteudo_completo TEXT NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABELA DE MÓDULOS E LIÇÕES DO CURSO DE TEOLOGIA
CREATE TABLE IF NOT EXISTS licoes_curso (
    id VARCHAR(100) PRIMARY KEY,
    lesson VARCHAR(100) NOT NULL,
    modulo_titulo VARCHAR(255) DEFAULT 'Curso de Teologia Básica',
    numero_modulo INT DEFAULT 1,
    titulo_licao VARCHAR(255) NOT NULL,
    numero_licao INT DEFAULT 1,
    description TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'Curso Teológico',
    conteudo TEXT NOT NULL,
    duracao_minutos INT DEFAULT 15,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABELA DE HISTÓRIAS & GEOGRAFIA SAGRADA
CREATE TABLE IF NOT EXISTS historias_biografias (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'character' ou 'place'
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    referencia_biblica VARCHAR(250),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. TABELA DE HOMENS DE DEUS (BIOGRAFIAS COM SINCRONIZAÇÃO EM TEMPO REAL)
CREATE TABLE IF NOT EXISTS homens_de_deus (
    id VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    imagem TEXT,
    era VARCHAR(100) DEFAULT 'Contemporâneo',
    birth_and_death VARCHAR(150),
    main_legacy VARCHAR(255),
    bible_verse TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. TABELA DE PUBLICAÇÕES (POSTS)
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'estudos', 'dicionario', 'historias', 'homens', 'teologia', 'curso', 'mensagens', 'noticias'
    image_url TEXT,
    author VARCHAR(100) DEFAULT 'Lemos Faya de Arcanjo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. TABELA DE COMENTÁRIOS (COMMENTS)
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(100) PRIMARY KEY,
    post_id VARCHAR(100) NOT NULL,
    name VARCHAR(150) DEFAULT 'Anónimo',
    comment TEXT NOT NULL,
    device_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. TABELA DE REAÇÕES (REACTIONS)
CREATE TABLE IF NOT EXISTS reactions (
    id VARCHAR(100) PRIMARY KEY,
    post_id VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'like', 'love', 'wow', 'sad', 'fire'
    device_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, device_id)
);

-- 14. TABELA DE ANÚNCIOS (ADS)
CREATE TABLE IF NOT EXISTS ads (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'banner', -- 'banner', 'native'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ATIVAR ROW LEVEL SECURITY (RLS)
ALTER TABLE homens_de_deus ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudos_basicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dicionario_biblico ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_biografias ENABLE ROW LEVEL SECURITY;
ALTER TABLE teologia_doutrinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE licoes_curso ENABLE ROW LEVEL SECURITY;
ALTER TABLE postagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_sociais ENABLE ROW LEVEL SECURITY;
ALTER TABLE progresso_estudante ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;


-- DEFINIR POLÍTICAS DE SEGURANÇA (RLS) DE FORMA REENTRANTE (EVITA ERROS SE RE-EXECUTADO)

-- 1. Homens de Deus
DROP POLICY IF EXISTS "Leitura pública para todos" ON homens_de_deus;
DROP POLICY IF EXISTS "Controle total para administradores" ON homens_de_deus;
DROP POLICY IF EXISTS "Acesso público irrestrito homens" ON homens_de_deus;
CREATE POLICY "Acesso público irrestrito homens" ON homens_de_deus FOR ALL USING (true) WITH CHECK (true);

-- 2. Estudos Básicos
DROP POLICY IF EXISTS "Leitura pública para estudos" ON estudos_basicos;
DROP POLICY IF EXISTS "Controle total para administradores estudos" ON estudos_basicos;
DROP POLICY IF EXISTS "Acesso público irrestrito estudos" ON estudos_basicos;
CREATE POLICY "Acesso público irrestrito estudos" ON estudos_basicos FOR ALL USING (true) WITH CHECK (true);

-- 3. Dicionário Bíblico
DROP POLICY IF EXISTS "Leitura pública para dicionario" ON dicionario_biblico;
DROP POLICY IF EXISTS "Controle total para administradores dicionario" ON dicionario_biblico;
DROP POLICY IF EXISTS "Acesso público irrestrito dicionario" ON dicionario_biblico;
CREATE POLICY "Acesso público irrestrito dicionario" ON dicionario_biblico FOR ALL USING (true) WITH CHECK (true);

-- 4. Histórias e Biografias
DROP POLICY IF EXISTS "Leitura pública para historias" ON historias_biografias;
DROP POLICY IF EXISTS "Controle total para administradores historias" ON historias_biografias;
DROP POLICY IF EXISTS "Acesso público irrestrito historias" ON historias_biografias;
CREATE POLICY "Acesso público irrestrito historias" ON historias_biografias FOR ALL USING (true) WITH CHECK (true);

-- 5. Teologia e Doutrinas
DROP POLICY IF EXISTS "Leitura pública para teologia" ON teologia_doutrinas;
DROP POLICY IF EXISTS "Controle total para administradores teologia" ON teologia_doutrinas;
DROP POLICY IF EXISTS "Acesso público irrestrito teologia" ON teologia_doutrinas;
CREATE POLICY "Acesso público irrestrito teologia" ON teologia_doutrinas FOR ALL USING (true) WITH CHECK (true);

-- 6. Lições do Curso
DROP POLICY IF EXISTS "Leitura pública para curso" ON licoes_curso;
DROP POLICY IF EXISTS "Controle total para administradores curso" ON licoes_curso;
DROP POLICY IF EXISTS "Acesso público irrestrito curso" ON licoes_curso;
CREATE POLICY "Acesso público irrestrito curso" ON licoes_curso FOR ALL USING (true) WITH CHECK (true);

-- 7. Postagens (Mural)
DROP POLICY IF EXISTS "Leitura pública para postagens" ON postagens;
DROP POLICY IF EXISTS "Controle total para administradores postagens" ON postagens;
DROP POLICY IF EXISTS "Acesso público irrestrito postagens" ON postagens;
CREATE POLICY "Acesso público irrestrito postagens" ON postagens FOR ALL USING (true) WITH CHECK (true);

-- 8. Configurações Sociais / Gerais
DROP POLICY IF EXISTS "Leitura pública para configuracoes" ON configuracoes_sociais;
DROP POLICY IF EXISTS "Controle total para administradores configuracoes" ON configuracoes_sociais;
DROP POLICY IF EXISTS "Acesso público irrestrito configuracoes" ON configuracoes_sociais;
CREATE POLICY "Acesso público irrestrito configuracoes" ON configuracoes_sociais FOR ALL USING (true) WITH CHECK (true);

-- 9. Progresso do Estudante
DROP POLICY IF EXISTS "Acesso público ao progresso" ON progresso_estudante;
CREATE POLICY "Acesso público ao progresso" ON progresso_estudante FOR ALL USING (true) WITH CHECK (true);

-- 10. Publicações (Posts)
DROP POLICY IF EXISTS "Leitura pública para posts" ON posts;
DROP POLICY IF EXISTS "Controle total para administradores posts" ON posts;
DROP POLICY IF EXISTS "Acesso público irrestrito posts" ON posts;
CREATE POLICY "Acesso público irrestrito posts" ON posts FOR ALL USING (true) WITH CHECK (true);

-- 11. Comentários (Comments)
DROP POLICY IF EXISTS "Leitura pública para comments" ON comments;
DROP POLICY IF EXISTS "Acesso total de escrita pública para comments" ON comments;
CREATE POLICY "Acesso total de escrita pública para comments" ON comments FOR ALL USING (true) WITH CHECK (true);

-- 12. Reações (Reactions)
DROP POLICY IF EXISTS "Leitura pública para reactions" ON reactions;
DROP POLICY IF EXISTS "Acesso total de escrita pública para reactions" ON reactions;
CREATE POLICY "Acesso total de escrita pública para reactions" ON reactions FOR ALL USING (true) WITH CHECK (true);

-- 13. Anúncios (Ads)
DROP POLICY IF EXISTS "Leitura pública para ads" ON ads;
DROP POLICY IF EXISTS "Controle total para administradores ads" ON ads;
DROP POLICY IF EXISTS "Acesso público irrestrito ads" ON ads;
CREATE POLICY "Acesso público irrestrito ads" ON ads FOR ALL USING (true) WITH CHECK (true);


-- ATIVAR SINCRONIZAÇÃO EM TEMPO REAL NO SUPABASE DE FORMA TOTALMENTE SEGURA E LIVRE DE ERROS
-- Esse bloco em PL/pgSQL executa de forma dinâmica para evitar o erro "already member of publication" caso os comandos sejam re-executados.
DO $$
DECLARE
    tabelas TEXT[] := ARRAY[
        'homens_de_deus',
        'estudos_basicos',
        'dicionario_biblico',
        'historias_biografias',
        'teologia_doutrinas',
        'licoes_curso',
        'postagens',
        'configuracoes_sociais',
        'posts',
        'comments',
        'reactions',
        'ads'
    ];
    tabela TEXT;
BEGIN
    -- Criar a publicação caso ela ainda não exista por algum motivo
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;

    -- Iterar e adicionar apenas as tabelas existentes que ainda não pertencem à publicação
    FOREACH tabela IN ARRAY tabelas LOOP
        -- Verificar primeiro se a tabela realmente existe no banco de dados
        IF EXISTS (
            SELECT 1 FROM pg_class c
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE c.relname = tabela AND n.nspname = 'public'
        ) THEN
            -- Se existe, verificar se já não está na publicação
            IF NOT EXISTS (
                SELECT 1 FROM pg_publication_rel pr 
                JOIN pg_publication p ON pr.prpubid = p.oid 
                JOIN pg_class c ON pr.prrelid = c.oid 
                WHERE p.pubname = 'supabase_realtime' AND c.relname = tabela
            ) THEN
                EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', tabela);
            END IF;
        END IF;
    END LOOP;
END $$;


-- INSERIR DADOS INICIAIS (SEED) PARA EVITAR QUE A TABELA FIQUE VAZIA
INSERT INTO homens_de_deus (id, nome, descricao, imagem, era, birth_and_death, main_legacy, bible_verse) VALUES
('spurgeon', 'Charles Haddon Spurgeon', 'Charles Haddon Spurgeon foi um lendário pregador batista reformado britânico, reverenciado até hoje como o "Príncipe dos Pregadores". Ele pretejou seu primeiro sermão aos 16 anos e pastoreou o Tabernáculo Metropolitano durante 38 anos, atraindo audiências de mais de 10.000 pessoas semanalmente sem amplificação.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', 'Século XIX', '1834 – 1892', 'O Príncipe dos Pregadores', 'Hebreus 13:7 - Lembrai-vos dos vossos guias, os quais vos falaram a palavra de Deus...'),
('billy_graham', 'William Franklin Billy Graham', 'William Franklin Graham Jr., mundialmente conhecido por Billy Graham, foi um evangelista americano que pregou pessoalmente a mais de 200 milhões de almas em quase todos os continentes do globo terrestre. Graham atuou como conselheiro espiritual de diversos presidentes dos EUA.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Século XX', '1918 – 2018', 'O Evangelista das Nações', '2 Timóteo 4:5 - Tu, porém, sê sóbrio em tudo, sofre as aflições, faze a obra de um evangelista, cumpre o teu ministério.'),
('lutero', 'Martinho Lutero', 'Martinho Lutero foi um proeminente monge agostiniano e professor de teologia alemão que se tornou a figura central da Reforma Protestante do Século XVI. Ele fixou suas célebres 95 Teses em 31 de Outubro de 1517 na porta da Igreja de Wittenberg.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Reforma Protestante (Século XVI)', '1483 – 1546', 'Pai do Protestantismo e Reformador', 'Romanos 1:17 - O justo viverá pela fé.'),
('john_wesley', 'John Wesley', 'John Wesley foi um clérigo anglicano e teólogo britânico que liderou o avivamento metodista do século XVIII. Wesley percorreu milhares de quilômetros a cavalo pregando e promovendo o discipulado em grupos.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', 'Século XVIII', '1703 – 1791', 'Líder do Avivamento Metodista', 'Gálatas 5:6 - Fé que opera pelo amor.')
ON CONFLICT (id) DO NOTHING;

-- SEED DE ANÚNCIOS INICIAIS
INSERT INTO ads (id, title, image_url, link, type, active) VALUES
('inicial_ad_1', 'Canal Oficial Escola da Fé - Inscreva-se para Novidades', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600', 'https://youtube.com/escoladafe', 'native', true),
('inicial_ad_2', 'Visite o nosso grupo exclusivo de WhatsApp de Intercessão', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', 'https://chat.whatsapp.com/ExemploGrupo', 'banner', true)
ON CONFLICT (id) DO NOTHING;
