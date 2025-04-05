import config from '../config.cjs';

const push = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['push'];

    if (!validCommands.includes(cmd)) return;
    
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    if (!m.isGroup) return m.reply("*This command only works in groups!*");

    const groupMembers = await gss.groupMetadata(m.from).then(metadata => metadata.participants.map(p => p.id));

    const imageUrl = 'https://i.ibb.co/DD7NkZvM/5de7075c3506b04ed19f09fb5d8f838a.jpg';
    
    
    for (const member of groupMembers) {
      try {
        
        await gss.sendMessage(member, {
          image: { url: imageUrl },
          caption: text || '*Hello from the group 🚀*',
          mentions: [member]
        });
      } catch (err) {
        console.error(`Failed to send message to ${member}:`, err);
      }
    }

    m.reply(`Message sent to ${groupMembers.length} group members successfully!`);

  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default push;
