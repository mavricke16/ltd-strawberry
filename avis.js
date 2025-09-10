const form = document.getElementById("avisForm");
const confirmation = document.getElementById("confirmation");
const avisList = document.getElementById("avis-list");

const webhookURL = "https://discord.com/api/webhooks/1413289856121176145/TKtBP1rnt9CvmLdZYO3fK35C2WgTrYEozbDS9T8f9TKyZNWlSX3ovkavemPUbJhD2ecq";

function addAvisCard(pseudo, vendeur, note, commentaire) {
  const card = document.createElement("div");
  card.classList.add("avis-card");
  card.innerHTML = `
    <h3>${pseudo} <button class="delete-btn" style="float:right; background:none; border:none; color:red; cursor:pointer;">❌</button></h3>
    <p class="note">⭐ ${note}</p>
    <p><strong>Vendeur :</strong> ${vendeur}</p>
    <p>${commentaire}</p>
  `;
  
  card.querySelector(".delete-btn").addEventListener("click", () => {
    card.remove();

    const avisStockes = JSON.parse(localStorage.getItem("avisLTD")) || [];
    const index = avisStockes.findIndex(a =>
      a.pseudo === pseudo && a.vendeur === vendeur && a.note === note && a.commentaire === commentaire
    );
    if (index > -1) {
      avisStockes.splice(index, 1);
      localStorage.setItem("avisLTD", JSON.stringify(avisStockes));
    }
  });

  avisList.prepend(card);
}

function loadAvis() {
  const avisStockes = JSON.parse(localStorage.getItem("avisLTD")) || [];
  avisStockes.forEach(a => addAvisCard(a.pseudo, a.vendeur, a.note, a.commentaire));
}

function saveAvis(pseudo, vendeur, note, commentaire) {
  const avisStockes = JSON.parse(localStorage.getItem("avisLTD")) || [];
  avisStockes.unshift({ pseudo, vendeur, note, commentaire }); 
  localStorage.setItem("avisLTD", JSON.stringify(avisStockes));
}

loadAvis();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const vendeur = document.getElementById("vendeur").value.trim();
  const pseudo = document.getElementById("pseudo").value.trim();
  const note = document.getElementById("note").value;
  const commentaire = document.getElementById("commentaire").value.trim() || "Aucun commentaire.";

  if (!vendeur || !pseudo || !note) {
    alert("❌ Merci de remplir tous les champs.");
    return;
  }

  const payload = {
    username: "📢 Avis Client - LTD Strawberry",
    avatar_url: "https://i.imgur.com/iEC2zma.png",
    embeds: [
      {
        title: "✨ Nouvel avis client",
        color: 15158332,
        fields: [
          { name: "👤 Client", value: pseudo, inline: true },
          { name: "🛒 Vendeur", value: vendeur, inline: true },
          { name: "⭐ Note", value: note, inline: false },
          { name: "💬 Commentaire", value: commentaire, inline: false }
        ],
        footer: {
          text: "🍓 LTD Strawberry - Collecte des avis",
          icon_url: "https://i.imgur.com/iEC2zma.png"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Erreur Webhook Discord :", err);
  }

  addAvisCard(pseudo, vendeur, note, commentaire);
  saveAvis(pseudo, vendeur, note, commentaire);

  confirmation.style.display = "block";
  form.reset();
  setTimeout(() => { confirmation.style.display = "none"; }, 4000);
});