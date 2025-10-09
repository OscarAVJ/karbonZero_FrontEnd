import * as ChannelController from "../controllers/channelController.js";

export async function render() {
  loadCSS();
  return `
<div class="container py-4" id="canal-chat" style="display: flex; flex-direction: column; height: 100vh;">
    <div style="display: flex; flex: 1; overflow: hidden;">
        <div style="width: 25%; min-width: 200px; border-right: 1px solid #ccc; padding: 1rem; overflow-y: auto;">
            <div style="margin-bottom: 1rem; position: relative;">
                <h6 style="font-weight: bold; font-size: 1.3rem; color: #007C65;">Posts Pendientes: </h6>
            </div>
            <div id="chat-list"></div>
        </div>
        <div style="width: 50%; min-width: 300px; display: flex; flex-direction: column; padding: 1rem;">
            <div
                style="display: flex; align-items: center; gap: 0.6rem; font-weight: bold; font-size: 1.2rem; color: #007C65; margin-bottom: 1rem;">
                <img id="channelImg" src="img/logorical.png"
                    style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" />
                <p id="channelName">Compañía</p>
            </div>

            <div id="chat-content"
                style="flex: 1 1 auto; display: flex; flex-direction: column; gap: 1rem; background: #eeeeee; padding: 1rem; border-radius: 10px; overflow-y: auto;">
            </div>

            <div style="display: flex; align-items: center; margin-top: 1rem;">
                <input type="text" placeholder="Escribe un mensaje"
                    style="flex: 1; padding: 0.6rem 1rem; border-radius: 30px; border: 1px solid #ccc;" />
                <button
                    style="margin-left: 0.5rem; background-color: #007C65; color: white; border: none; border-radius: 12%; width: 42px; height: 42px; font-size: 1.2rem;">➤</button>
            </div>
        </div>
        <div
            style="width: 25%; min-width: 200px; padding: 1rem; display: flex; flex-direction: column; overflow-y: auto;">
            <div style="text-align: center; margin-bottom: 1rem;">
                <img src="img/logorical.png" style="width: 110px; height: auto;" alt="Logo" />
            </div>

            <div style="text-align: center; font-weight: bold; color: #007C65; margin-bottom: 0.8rem;">
                Información general
            </div>

            <div style="font-size: 0.95rem; line-height: 1.5; color: #007C65; margin-bottom: 1rem;">
                <p><strong>Institución:</strong><br>Instituto Técnico Ricaldone</p>
                <p><strong>Nombre:</strong><br>Juan Pablo López</p>
                <p><strong>Correo Electrónico:</strong><br>juanp123@gmail.com</p>
            </div>

            <div style="flex-grow: 1; display: flex; flex-direction: column;">
                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Información adicional</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>

                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Archivos compartidos</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>

                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Links compartidos</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>
                
                <div class="dropdown-section"
                    style="border-top: 1px solid #ccc; cursor: default; padding: 0.6rem 0; user-select: none;">
                    <div class="dropdown-title"
                        style="display: flex; align-items: center; justify-content: space-between;">
                        <span style="color: #007C65; font-weight: bold;">Documentos compartidos</span>
                        <iconify-icon class="arrow" icon="mdi:play"
                            style="color: #007C65; font-size: 24px; cursor: pointer; transition: transform 0.3s ease;"></iconify-icon>
                    </div>
                    <div class="dropdown-content"
                        style="display: none; color: gray; font-size: 0.95rem; margin-top: 0.6rem; padding-left: 0.5rem;">
                        Aún no se encuentra nada.
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  `;
}
export function afterRender() {
  initChannel();
}

function loadCSS() {
  const id = "channels-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../css/channel.css";
    link.id = id;
    document.head.appendChild(link);
  }
}

async function initChannel() {
  const chatList = document.querySelector("#chat-list");
  ChannelController.loadPendingMessages(chatList);

  const chatContent = document.querySelector("#chat-content");
  ChannelController.loadPosts(chatContent);

  const channelImg = document.querySelector("#channelImg");
  const channelName = document.querySelector("#channelName");
  ChannelController.loadChannelData(channelName, channelImg);

  ChannelController.initializeEventListeners(chatList, chatContent);

  document.querySelectorAll(".dropdown-section").forEach((section) => {
    const title = section.querySelector(".dropdown-title");
    const content = section.querySelector(".dropdown-content");
    const arrow = section.querySelector(".arrow");

    title.addEventListener("click", () => {
      const isOpen = content.style.display === "block";

      // Cierra todos
      document
        .querySelectorAll(".dropdown-content")
        .forEach((c) => (c.style.display = "none"));
      document
        .querySelectorAll(".arrow")
        .forEach((a) => (a.style.transform = "rotate(0deg)"));

      if (!isOpen) {
        content.style.display = "block";
        arrow.style.transform = "rotate(90deg)";
      }
    });

    setTimeout(() => {
      document.querySelectorAll(".check-icon").forEach((el) => {
        el.addEventListener(
          "mouseover",
          () => (el.style.transform = "scale(1.2)")
        );
        el.addEventListener(
          "mouseout",
          () => (el.style.transform = "scale(1)")
        );
        el.addEventListener("click", () => {
          el.style.color = "#005d3c";
          el.style.transform = "scale(1.4)";
          setTimeout(() => (el.style.transform = "scale(1)"), 150);
        });
      });

      document.querySelectorAll(".close-icon").forEach((el) => {
        el.addEventListener(
          "mouseover",
          () => (el.style.transform = "scale(1.2)")
        );
        el.addEventListener(
          "mouseout",
          () => (el.style.transform = "scale(1)")
        );
        el.addEventListener("click", () => {
          el.style.color = "#7c0000";
          el.style.transform = "scale(1.4)";
          setTimeout(() => (el.style.transform = "scale(1)"), 150);
        });
      });
    }, 100);
  });
  const styleResponsive = document.createElement("style");
  styleResponsive.innerHTML = `
  @media (max-width: 768px) {
    #canal-chat > div {
      flex-direction: row;
      overflow: hidden;
    }

    #canal-chat > div > div:first-child, /* Panel izquierdo */
    #canal-chat > div > div:last-child {  /* Panel derecho */
      display: none !important;
    }

    #canal-chat > div > div:nth-child(2) {
      width: 100% !important;
      min-width: unset !important;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    #chat-content {
      flex: 1 1 auto;
      overflow-y: auto;
    }
  }
`;
  document.head.appendChild(styleResponsive);
}
