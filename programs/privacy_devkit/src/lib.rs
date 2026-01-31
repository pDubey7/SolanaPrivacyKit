use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod privacy_devkit {
    use super::*;

    /// Initialize: optional root for future PDA-based state.
    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Privacy Devkit program initialized (devnet)");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
