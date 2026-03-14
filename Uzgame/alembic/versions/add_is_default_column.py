"""Add is_default column to game_test_sets

Revision ID: 001_add_is_default
Revises: 
Create Date: 2026-03-02

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "001_add_is_default"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_default column if it doesn't exist
    op.add_column('game_test_sets', sa.Column('is_default', sa.Boolean(), nullable=False, server_default='0'))


def downgrade() -> None:
    op.drop_column('game_test_sets', 'is_default')
