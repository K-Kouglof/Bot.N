// utils/configManager.js
import { createClient } from '@supabase/supabase-js';

// SupabaseのURLとキーは環境変数や直接埋め込みで指定（開発中であれば以下のように直接書いてもOK）
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

// 単一チャンネルの設定を取得
export async function getChannelConfig(channelId) {
  const { data, error } = await supabase
    .from('channel_settings')
    .select('*')
    .eq('channel_id', channelId)
    .single();

  if (error) {
    console.error('❌ 設定取得エラー:', error.message);
    return null;
  }

  return {
    notifyRoleId: data.notify_role_id,
    threadChannelId: data.thread_channel_id,
    vcCategoryId: data.vc_category_id,
  };
}

// 単一チャンネルの設定を更新
export async function updateChannelConfig(channelId, updateData) {
  const { error } = await supabase
    .from('channel_settings')
    .upsert({
      channel_id: channelId,
      notify_role_id: updateData.notifyRoleId,
      thread_channel_id: updateData.threadChannelId,
      vc_category_id: updateData.vcCategoryId,
    });

  if (error) {
    console.error('❌ 設定保存エラー:', error.message);
    throw new Error('設定の保存に失敗しました');
  }
}

// 全設定を取得
export async function loadConfig() {
  const { data, error } = await supabase
    .from('channel_settings')
    .select('*');

  if (error) {
    console.error('❌ 設定取得エラー:', error.message);
    return {};
  }

  const config = {};
  for (const row of data) {
    config[row.channel_id] = {
      notifyRoleId: row.notify_role_id,
      threadChannelId: row.thread_channel_id,
      vcCategoryId: row.vc_category_id,
    };
  }
  return config;
}

// 全設定を保存（上書き）
export async function saveConfig(config) {
  const updates = Object.entries(config).map(([channel_id, values]) => ({
    channel_id,
    notify_role_id: values.notifyRoleId,
    thread_channel_id: values.threadChannelId,
    vc_category_id: values.vcCategoryId,
  }));

  const { error } = await supabase
    .from('channel_settings')
    .upsert(updates);

  if (error) {
    console.error('❌ 設定保存エラー:', error.message);
    throw new Error('設定の保存に失敗しました');
  }
}
