(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(e,t={}){this.parent=e,this.onDelete=t.onDelete||(()=>{}),this.onView=t.onView||(()=>{}),this.onEdit=t.onEdit||(()=>{})}getHTML(e){return`
            <div class="ingredient-card" id="ingredient-card-${e.id}">
                <img src="${e.image}" class="ingredient-card-img" alt="${e.name}">
                <div class="ingredient-card-body">
                    <h3 class="ingredient-card-title">${e.name}</h3>
                    <p class="ingredient-card-desc">${e.description}</p>
                    <div class="ingredient-card-info">
                        <span>📦 ${e.category}</span>
                        <span>⚖️ ${e.unit}</span>
                        <span>💰 ${e.price} ₽</span>
                    </div>
                    <div class="ingredient-card-buttons">
                        <button class="btn-view" id="view-${e.id}">🔍 Подробнее</button>
                        <button class="btn-edit" id="edit-${e.id}">✏️ Редактировать</button>
                        <button class="btn-delete" id="delete-${e.id}">🗑️ Удалить</button>
                    </div>
                </div>
            </div>
        `}addListeners(e){document.getElementById(`view-${e.id}`)?.addEventListener(`click`,()=>{this.onView(e.id)}),document.getElementById(`edit-${e.id}`)?.addEventListener(`click`,()=>{this.onEdit(e.id)}),document.getElementById(`delete-${e.id}`)?.addEventListener(`click`,()=>{confirm(`Удалить ингредиент "${e.name}"?`)&&this.onDelete(e.id)})}render(e){let t=this.getHTML(e);this.parent.insertAdjacentHTML(`beforeend`,t),this.addListeners(e)}},t={async get(e){let t=await fetch(e);if(!t.ok)throw Error(`HTTP ${t.status}`);return await t.json()},async post(e,t){let n=await fetch(e,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});if(!n.ok)throw Error(`HTTP ${n.status}`);return await n.json()},async patch(e,t){let n=await fetch(e,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify(t)});if(!n.ok)throw Error(`HTTP ${n.status}`);return await n.json()},async delete(e){let t=await fetch(e,{method:`DELETE`});if(!t.ok&&t.status!==204)throw Error(`HTTP ${t.status}`);return t.status===204?null:await t.json()}},n=new class{constructor(){this.baseUrl=`http://localhost:3000/api`}getIngredients(e){return e?`${this.baseUrl}/ingredients?name=${encodeURIComponent(e)}`:`${this.baseUrl}/ingredients`}getIngredientById(e){return`${this.baseUrl}/ingredients/${e}`}createIngredient(){return`${this.baseUrl}/ingredients`}updateIngredientById(e){return`${this.baseUrl}/ingredients/${e}`}deleteIngredientById(e){return`${this.baseUrl}/ingredients/${e}`}},r=class{constructor(e,t){this.parent=e,this.ingredientId=t,this.ingredient=null}async loadIngredient(){try{let e=n.getIngredientById(this.ingredientId),r=await t.get(e);this.ingredient=r,this.renderData()}catch(e){console.error(`Ошибка загрузки ингредиента:`,e),this.showError()}}getHTML(){return this.ingredient?`
            <div class="container mt-4">
                <button class="btn btn-secondary mb-3" id="back-to-list">← Назад к списку</button>
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-5">
                            <img src="${this.ingredient.image}" class="img-fluid rounded-start" 
                                 alt="${this.ingredient.name}" style="width: 100%; max-height: 300px; object-fit: cover;">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                                <h2 class="card-title">${this.ingredient.name}</h2>
                                <p class="card-text">${this.ingredient.description}</p>
                                <hr>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>📦 Категория:</strong> ${this.ingredient.category}</li>
                                    <li class="list-group-item"><strong>⚖️ Единица измерения:</strong> ${this.ingredient.unit}</li>
                                    <li class="list-group-item"><strong>💰 Цена:</strong> ${this.ingredient.price} ₽</li>
                                </ul>
                                <div class="mt-3">
                                    <button class="btn btn-warning" id="edit-ingredient">✏️ Редактировать</button>
                                    <button class="btn btn-danger" id="delete-ingredient">🗑️ Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `:`<div class="alert alert-info">Загрузка...</div>`}showError(){let e=document.getElementById(`ingredient-detail-container`);e&&(e.innerHTML=`<div class="alert alert-danger">Ингредиент не найден</div>`)}renderData(){let e=document.getElementById(`ingredient-detail-container`);e&&(e.innerHTML=this.getHTML(),this.addListeners())}addListeners(){document.getElementById(`back-to-list`)?.addEventListener(`click`,()=>{window.location.hash=``,window.location.reload()}),document.getElementById(`edit-ingredient`)?.addEventListener(`click`,()=>{window.location.hash=`ingredient-form/edit/${this.ingredientId}`}),document.getElementById(`delete-ingredient`)?.addEventListener(`click`,async()=>{if(confirm(`Удалить ингредиент "${this.ingredient.name}"?`))try{await t.delete(n.deleteIngredientById(this.ingredientId)),window.location.hash=``}catch(e){console.error(`Ошибка удаления:`,e)}})}render(){this.parent.innerHTML=`<div id="ingredient-detail-container"></div>`,this.loadIngredient()}},i=class{constructor(e){this.parent=e,this.filteredIngredients=[],this.allIngredients=[]}async loadIngredients(e=``){try{let r=n.getIngredients(e),i=await t.get(r);this.allIngredients=i,this.filteredIngredients=[...this.allIngredients],this.renderIngredients()}catch(e){console.error(`Ошибка загрузки:`,e)}}filterIngredients(e){this.loadIngredients(e)}async addFirstCardCopy(){if(this.allIngredients.length>0){let e=this.allIngredients[0],r={name:`${e.name} (копия)`,description:e.description,image:e.image,category:e.category,unit:e.unit,price:e.price};try{await t.post(n.createIngredient(),r),this.loadIngredients()}catch(e){console.error(`Ошибка добавления:`,e)}}}async deleteIngredient(e){try{await t.delete(n.deleteIngredientById(e)),this.loadIngredients()}catch(e){console.error(`Ошибка удаления:`,e)}}showIngredientDetail(e){new r(this.parent,e).render()}renderIngredients(){let t=document.getElementById(`ingredients-list`);t&&t.remove();let n=document.createElement(`div`);if(n.id=`ingredients-list`,n.className=`ingredients-grid`,this.parent.appendChild(n),this.filteredIngredients.length===0){n.innerHTML=`<div class="alert alert-info">Ингредиенты не найдены</div>`;return}this.filteredIngredients.forEach(t=>{new e(n,{onDelete:e=>this.deleteIngredient(e),onView:e=>this.showIngredientDetail(e),onEdit:e=>window.location.hash=`ingredient-form/edit/${e}`}).render(t)})}render(){this.parent.innerHTML=``;let e=document.createElement(`div`);e.className=`container mt-4`,this.parent.appendChild(e),e.innerHTML=`
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <h1>📦 Ингредиенты для кофе</h1>
                <div class="btn-group mt-2 mt-md-0">
                    <button class="btn btn-success" id="add-ingredient-btn">+ Добавить ингредиент</button>
                </div>
            </div>
            <div class="mb-4">
                <input type="text" class="form-control" id="search-input" placeholder="Поиск ингредиентов...">
            </div>
            <div id="stats-message" class="mb-3"></div>
            <div id="ingredients-list" class="ingredients-grid"></div>
        `,this.loadIngredients(),document.getElementById(`search-input`).addEventListener(`input`,e=>{this.filterIngredients(e.target.value)}),document.getElementById(`add-ingredient-btn`).addEventListener(`click`,()=>{this.addFirstCardCopy()}),this.parent.addEventListener(`navigate-home`,()=>{this.render()})}},a=class{constructor(e,t={}){this.parent=e,this.id=t.id,this.isEdit=!!this.id}async loadIngredientData(){if(this.isEdit)try{let e=await t.get(n.getIngredientById(this.id));document.getElementById(`name`).value=e.name||``,document.getElementById(`description`).value=e.description||``,document.getElementById(`image`).value=e.image||``,document.getElementById(`category`).value=e.category||``,document.getElementById(`unit`).value=e.unit||``,document.getElementById(`price`).value=e.price||``}catch(e){console.error(`Ошибка загрузки:`,e)}}async onSubmit(){let e={name:document.getElementById(`name`).value,description:document.getElementById(`description`).value,image:document.getElementById(`image`).value,category:document.getElementById(`category`).value,unit:document.getElementById(`unit`).value,price:parseInt(document.getElementById(`price`).value)||0};try{this.isEdit?await t.patch(n.updateIngredientById(this.id),e):await t.post(n.createIngredient(),e),window.location.hash=``}catch(e){console.error(`Ошибка сохранения:`,e)}}getHTML(){return`
            <div class="container mt-4">
                <button class="btn btn-secondary mb-3" id="back-btn">← Назад</button>
                <div class="card">
                    <div class="card-body">
                        <h2>${this.isEdit?`✏️ Редактировать`:`➕ Добавить`} ингредиент</h2>
                        <hr>
                        <form id="ingredient-form">
                            <div class="mb-3">
                                <label class="form-label">Название *</label>
                                <input type="text" class="form-control" id="name" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Описание</label>
                                <textarea class="form-control" id="description" rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">URL изображения</label>
                                <input type="text" class="form-control" id="image">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Категория</label>
                                <input type="text" class="form-control" id="category">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Единица измерения</label>
                                <input type="text" class="form-control" id="unit">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Цена (₽)</label>
                                <input type="number" class="form-control" id="price">
                            </div>
                            <button type="submit" class="btn btn-primary">💾 Сохранить</button>
                        </form>
                    </div>
                </div>
            </div>
        `}addListeners(){document.getElementById(`back-btn`)?.addEventListener(`click`,()=>{window.location.hash=``}),document.getElementById(`ingredient-form`)?.addEventListener(`submit`,e=>{e.preventDefault(),this.onSubmit()})}render(){this.parent.innerHTML=this.getHTML(),this.addListeners(),this.loadIngredientData()}},o=document.getElementById(`app-content`);function s(){o.innerHTML=`<div id="main-root"></div>`,new i(o.querySelector(`#main-root`)).render()}function c(e={}){o.innerHTML=`<div id="form-root"></div>`,new a(o.querySelector(`#form-root`),e).render()}function l(e){o.innerHTML=`<div id="detail-root"></div>`,new r(o.querySelector(`#detail-root`),e).render()}var u=document.getElementById(`nav-recipes`),d=document.getElementById(`home-link`);u&&u.addEventListener(`click`,e=>{e.preventDefault(),s(),window.location.hash=``}),d&&d.addEventListener(`click`,e=>{e.preventDefault(),s(),window.location.hash=``}),window.addEventListener(`hashchange`,()=>{let e=window.location.hash;e.startsWith(`#ingredient-form/edit/`)?c({id:e.split(`/`).pop()}):e===`#ingredient-form/new`?c({}):e.startsWith(`#ingredient-detail/`)?l(e.split(`/`).pop()):s()}),s();