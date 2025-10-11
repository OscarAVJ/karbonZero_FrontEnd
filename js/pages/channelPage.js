import * as ChannelController from "../controllers/channelController.js";
import * as ImageService from "../services/imageService.js";
import * as Alerts from "../../utils/alerts.js";

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
                <img id="channelImg" src="logo.png"
                    style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="Logo" />
                <p id="channelName">Canal</p>
            </div>

            <div id="chat-content"
                style="flex: 1 1 auto; display: flex; flex-direction: column; gap: 1rem; background: #eeeeee; padding: 1rem; border-radius: 10px; overflow-y: auto;">
            </div>

            <!--
            <div style="display: flex; align-items: center; margin-top: 1rem;">
                <input type="text" placeholder="Escribe un mensaje"
                    style="flex: 1; padding: 0.6rem 1rem; border-radius: 30px; border: 1px solid #ccc;" />
                <button
                    style="margin-left: 0.5rem; background-color: #007C65; color: white; border: none; border-radius: 12%; width: 42px; height: 42px; font-size: 1.2rem;">➤</button>
            </div>
            -->
        </div>
        <div
            style="width: 25%; min-width: 200px; padding: 1rem; display: flex; flex-direction: column; overflow-y: auto;">
            <div style="display: flex; text-align: center; justify-content: center; align-items: end; margin-bottom: 1rem;">
                <img id="bigChannelImg" src="../../assets/imgs/defaultPfp.png" style="width: 110px; height: auto;" alt="Logo"/>
                <button class="btn edit-button" id="channelNameEdit" data-bs-toggle="modal" data-bs-target="#imgModal"><i class="bi bi-pencil-fill"></i></button>

            </div>

            <h5 style="text-align: center; font-weight: bold; color: #007C65; margin-bottom: 0.8rem;">
                Información del canal
            </h5>

            <div style="font-size: 0.95rem; line-height: 1.5; color: #007C65; margin-bottom: 1rem;">
                <div>
                    <div>
                        <h6 class="d-inline"><strong>Nombre:</strong></h6>
                        <button class="btn edit-button" id="channelNameEdit" data-bs-toggle="modal" data-bs-target="#editModal"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                    <p id="channelNameLabel">KarbonZero</p>
                </div>
                <div>
                    <div>
                        <h6 class="d-inline"><strong>Descripción:</strong></h6>
                        <button class="btn edit-button" id="channelNameEdit" data-bs-toggle="modal" data-bs-target="#descriptionModal"><i class="bi bi-pencil-fill"></i></button>
                    </div>
                    <p id="channelDescriptionLabel">Descripción del canal</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content kz-modal-mongo border-0">
            <div class="modal-header" style="justify-content: center; position: relative;">
                <h4 class="kz-modal-title">Editar</h4>
                <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                    data-bs-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <form id="editForm">
                <div class="modal-body mx-3">
                    <div class="row g-2 mb-3">
                       <input id="editTxt" type="text" class="form-control" placeholder="Nombre">
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button type="submit" class="btn kz-button-create">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade" id="descriptionModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content kz-modal-mongo border-0">
            <div class="modal-header" style="justify-content: center; position: relative;">
                <h4 class="kz-modal-title">Editar</h4>
                <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                    data-bs-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <form id="descriptionForm">
                <div class="modal-body mx-3">
                    <div class="row g-2 mb-3">
                       <textarea id="descriptionTxt" type="text" class="form-control" placeholder="Descripción"></textarea>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button type="submit" class="btn kz-button-create">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</div>
<div class="modal fade" id="imgModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content kz-modal-mongo border-0">
            <div class="modal-header" style="justify-content: center; position: relative;">
                <h4 class="kz-modal-title">Editar</h4>
                <button type="button" class="btn-close" style="position: absolute; right: 1rem; top: 1rem;"
                    data-bs-dismiss="modal" aria-label="Close">
                </button>
            </div>
            <form id="imgForm">
                <div class="modal-body mx-3">
                    <div class="row g-2 mb-3">
                        <div class="col mb-2">
                            <input class="form-control" type="file" id="fileImg" accept="image/*" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-center">
                    <button type="submit" class="btn kz-button-create">Guardar</button>
                </div>
            </form>
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
  const bigChannelImg = document.querySelector("#bigChannelImg");
  const channelName = document.querySelector("#channelName");

  ChannelController.initializeEventListeners(chatList, chatContent);

  const editModal = document.querySelector("#editModal");
  const bsEditModal = bootstrap.Modal.getOrCreateInstance(editModal);
  const editForm = document.querySelector("#editForm");
  const editTxt = document.querySelector("#editTxt");
  const editLabel = document.querySelector("#channelNameLabel");

  const descriptModal = document.querySelector("#descriptionModal");
  const bsDesModal = bootstrap.Modal.getOrCreateInstance(descriptModal);
  const descriptionForm = document.querySelector("#descriptionForm");
  const descriptionTxt = document.querySelector("#descriptionTxt");
  const descriptionLabel = document.querySelector("#channelDescriptionLabel");

  await ChannelController.loadChannelData(
    editLabel,
    channelName,
    descriptionLabel,
    channelImg,
    bigChannelImg
  );

  let isLoading;
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!editTxt.value.trim()) {
      bsEditModal.hide();
      return;
    }

    if (isLoading) return;
    isLoading = true;

    const res = await ChannelController.updateChannelData(
      editTxt.value.trim(),
      descriptionLabel.textContent,
      bigChannelImg.src,
      editForm
    );

    bsEditModal.hide();
    isLoading = false;

    if (res?.ok) {
      await ChannelController.loadChannelData(
        editLabel,
        channelName,
        descriptionLabel,
        channelImg,
        bigChannelImg
      );
      Alerts.showToastCloseInfo("Información del canal actualizada");
    }
  });

  let isLoading2;
  descriptionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!descriptionTxt.value.trim()) {
      bsDesModal.hide();
      return;
    }

    if (isLoading2) return;
    isLoading2 = true;

    const res = await ChannelController.updateChannelData(
      editLabel.textContent,
      descriptionTxt.value.trim(),
      bigChannelImg.src,
      descriptionForm
    );

    bsDesModal.hide();
    isLoading2 = false;

    if (res?.ok) {
      await ChannelController.loadChannelData(
        editLabel,
        channelName,
        descriptionLabel,
        channelImg,
        bigChannelImg
      );
      Alerts.showToastCloseInfo("Información del canal actualizada");
    }
  });

  const imgModal = document.querySelector("#imgModal");
  const bsImgModal = bootstrap.Modal.getOrCreateInstance(imgModal);
  const imgForm = document.querySelector("#imgForm");
  const imageFileInput = document.getElementById("fileImg");

  let isLoading3;
  imgForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let finalImageURL = "";
    const file = imageFileInput?.files?.[0];

    if (file) {
      try {
        const data = await ImageService.uploadImageToFolder(file, "channelImg");
        finalImageURL = data.url || "";
      } catch (err) {
        console.error("Error subiendo imagenes:", err);
        Alerts.showToastCloseError(
          "No ha sido posible editar la foto del canal"
        );
        return;
      }
    }

    if (isLoading3) return;
    isLoading3 = true;

    let res = await ChannelController.updateChannelData(
      editLabel.textContent,
      descriptionLabel.textContent,
      finalImageURL,
      imgForm
    );

    bsImgModal.hide();
    isLoading3 = false;

    if (res?.ok) {
      await ChannelController.loadChannelData(
        editLabel,
        channelName,
        descriptionLabel,
        channelImg,
        bigChannelImg
      );
      Alerts.showToastCloseInfo("Información del canal actualizada");
    }
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
