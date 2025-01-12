-- Enable RLS
alter table public.chat_messages enable row level security;

-- Create policies
create policy "Users can view their own chat messages"
on public.chat_messages for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own chat messages"
on public.chat_messages for insert
to authenticated
with check (auth.uid() = user_id);

-- Create realtime publication
create publication chat_messages_publication for table chat_messages;