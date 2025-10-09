import * as channelService from "../services/channelService.js";

const processedIds = new Set();

export async function loadPendingMessages(chatContainer) {
  const messages = await channelService.getPostNoApproved();

  console.log(messages.data);
  chatContainer.innerHTML = "";

  messages.data.forEach((m) => {
    chatContainer.innerHTML += `
        <div style="padding-bottom: 0.8rem; margin-bottom: 0.8rem; border-bottom: 1px solid #ddd;">
          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #007C65; font-weight: bold;">${m.userName}</span>
              </div>
              <div style="font-weight: bold; font-size: 0.9rem;">${m.title}</div>
              <div style="font-size: 0.85rem; color: #444;">${m.descript}</div>
            </div>
          </div>
         <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 6px;">
            <button data-id="${m.idChannelPost}" class="p-1 approve-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-up-icon lucide-thumbs-up"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg></button>
            <button data-id="${m.idChannelPost}" class="p-1 no-approve-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-thumbs-down-icon lucide-thumbs-down"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg></button>
        </div>
        </div>
      `;
  });
}

export function initializeEventListeners(chatContainer) {
  chatContainer.addEventListener("click", async (e) => {
    const approveBtn = e.target.closest(".approve-button");
    const deleteBtn = e.target.closest(".no-approve-button");

    if (approveBtn) {
      const id = approveBtn.dataset.id;

      if (processedIds.has(id)) {
        console.log("Ya se está procesando este post");
        return;
      }

      processedIds.add(id);
      approveBtn.disabled = true;

      try {
        const ok = await channelService.approvePost(id);
        if (ok) await loadPendingMessages(chatContainer);
      } finally {
        processedIds.delete(id);
      }
    } else if (deleteBtn) {
      const id = deleteBtn.dataset.id;

      if (processedIds.has(id)) {
        console.log("Ya se está procesando este post");
        return;
      }

      processedIds.add(id);
      deleteBtn.disabled = true;

      try {
        const ok = await channelService.deletePost(id);
        if (ok) await loadPendingMessages(chatContainer);
      } finally {
        processedIds.delete(id);
      }
    }
  });
}
