-- Vortex Persistent State-Bus Schema (v1.0)
-- Purpose: Enable cross-session, multi-agent state persistence.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Conversations Table
CREATE TABLE IF NOT EXISTS vortex_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'OPEN', -- OPEN, CLOSED, ARCHIVED
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. History/Messages Table
CREATE TABLE IF NOT EXISTS vortex_history (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    conversation_id UUID REFERENCES vortex_conversations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    type TEXT NOT NULL, -- DIRECTIVE, STATUS, RESPONSE, ERROR
    content TEXT NOT NULL
);

-- 4. Indices for performance
CREATE INDEX IF NOT EXISTS idx_vortex_history_conv_id ON vortex_history(conversation_id);
CREATE INDEX IF NOT EXISTS idx_vortex_conversations_status ON vortex_conversations(status);

-- 5. Trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vortex_conversations_modtime
    BEFORE UPDATE ON vortex_conversations
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

COMMENT ON TABLE vortex_conversations IS 'Tracks high-level agentic task contexts.';
COMMENT ON TABLE vortex_history IS 'Persistent archive of inter-agent dialogue and state transitions.';
