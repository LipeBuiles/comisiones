document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const treeContainer = document.getElementById('tree-container');
    const selectedItemsContainer = document.getElementById('selected-items');
    const saveButton = document.getElementById('save-button');
    const loadTreeButton = document.getElementById('load-tree-button');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const esquemaSelect = document.getElementById('esquema-select');
    const categoriaSelect = document.getElementById('categoria-select');
    const selectGeneralBtn = document.getElementById('select-general-button');
    const applyGeneralBtn = document.getElementById('apply-general-button');
    const selectionModalEl = document.getElementById('selectionModal');
    // Flag para modo General
    let generalMode = false;
    // Inicializar estado de botones y contenedores
    if (applyGeneralBtn) {
        applyGeneralBtn.style.display = 'none';
    }
    const generalInfoSpan = document.getElementById('general-info');
    if (generalInfoSpan) {
        generalInfoSpan.innerHTML = '';
    }
    let selectedItems = {};
    let filteredData = [];
    let searchSelectedItems = {}; // Para almacenar los elementos seleccionados en la búsqueda
    let selectedEsquema = null; // Para almacenar el esquema seleccionado
    let selectedCategoria = null; // Para almacenar la categoría seleccionada

    // --- BEGIN MODAL CLOSE PREVENTION LOGIC ---
    let parentModalElement = null;
    if (loadTreeButton) {
        parentModalElement = loadTreeButton.closest('.modal');
        if (parentModalElement) {
            // Listener for Bootstrap's hide event
            parentModalElement.addEventListener('hide.bs.modal', function(event) {
                if (parentModalElement.dataset.preventModalClose === 'true') {
                    event.preventDefault(); // Prevent modal from closing
                    // Reset the flag so that subsequent close attempts (e.g., by 'X', ESC, or 'Cerrar' button) are not blocked
                    // unless the validation fails again on a "Cargar árbol" click.
                    parentModalElement.dataset.preventModalClose = 'false';
                }
            });
        }
    }
    // --- END MODAL CLOSE PREVENTION LOGIC ---

    // Listener to reset selects and validation when modal is shown
    if (parentModalElement) {
        parentModalElement.addEventListener('show.bs.modal', function() {
            initDefaultValues(); // Resets selectedEsquema, selectedCategoria, and select values
            if (esquemaSelect) {
                esquemaSelect.classList.remove('is-invalid');
            }
            if (categoriaSelect) {
                categoriaSelect.classList.remove('is-invalid');
            }
            
            // Ocultar chips de información de esquema y categoría
            const esquemaInfo = document.getElementById('esquema-info');
            if (esquemaInfo) {
                esquemaInfo.style.display = 'none';
            }
            
            const categoriaInfo = document.getElementById('categoria-info');
            if (categoriaInfo) {
                categoriaInfo.style.display = 'none';
            }
            
            // Ocultar mensaje de error de nivel DCS
            const levelErrorContainer = document.querySelector('.level-error');
            if (levelErrorContainer) {
                levelErrorContainer.style.display = 'none';
            }
            // Mostrar/ocultar botones y secciones según modo General
            if (generalMode) {
                // Mostrar botón Aplicar al General, ocultar Cargar árbol
                applyGeneralBtn.style.display = 'inline-block';
                loadTreeButton.style.display = 'none';
                // Ocultar bloque de nivel
                const levelDiv = selectionModalEl.querySelector('label[for="level-region"]').closest('.mb-3');
                if (levelDiv) levelDiv.style.display = 'none';
                // Ocultar bloque de búsqueda
                const searchDiv = selectionModalEl.querySelector('#search-input').closest('.mb-3');
                if (searchDiv) searchDiv.style.display = 'none';
                // Ocultar resultados y mensaje de nivel-error
                const resultsDiv = selectionModalEl.querySelector('#search-results').closest('.mb-3');
                if (resultsDiv) resultsDiv.style.display = 'none';
            } else {
                // Modo normal (+): mostrar botones y bloques por defecto
                applyGeneralBtn.style.display = 'none';
                loadTreeButton.style.display = 'inline-block';
                // Mostrar bloque de nivel
                const levelDiv = selectionModalEl.querySelector('label[for="level-region"]').closest('.mb-3');
                if (levelDiv) levelDiv.style.display = '';
                // Mostrar bloque de búsqueda
                const searchDiv = selectionModalEl.querySelector('#search-input').closest('.mb-3');
                if (searchDiv) searchDiv.style.display = '';
                // Ocultar resultados y mensaje de error
                const resultsDiv = selectionModalEl.querySelector('#search-results').closest('.mb-3');
                if (resultsDiv) resultsDiv.style.display = 'none';
                const levelError = selectionModalEl.querySelector('.level-error');
                if (levelError) levelError.style.display = 'none';
            }
            
            // Limpiar el objeto searchSelectedItems para que esté vacío en cada apertura del modal
            searchSelectedItems = {};
            
            // Limpiar el campo de búsqueda y ocultar resultados
            if (searchInput) {
                searchInput.value = '';
            }
            if (searchResults) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
            
            // Ensure the prevent close flag is reset when modal is freshly shown
            parentModalElement.dataset.preventModalClose = 'false';
            // Ajustes según modo (General vs +)
            if (generalMode) {
                // Ocultar selección de nivel
                const levelBlock = selectionModalEl.querySelector('label[for="level-region"]').closest('.mb-3');
                if (levelBlock) levelBlock.style.display = 'none';
                // Ocultar buscador y resultados
                const searchBlock = selectionModalEl.querySelector('#search-input').closest('.mb-3');
                if (searchBlock) searchBlock.style.display = 'none';
                const resultsBlock = selectionModalEl.querySelector('#search-results').closest('.mb-3');
                if (resultsBlock) resultsBlock.style.display = 'none';
                // Mostrar botón Aplicar al General, ocultar Cargar árbol
                applyGeneralBtn.style.display = 'inline-block';
                loadTreeButton.style.display = 'none';
            } else {
                // Modo normal (+): mostrar secciones y botones por defecto
                // Restaurar visibilidad de bloques
                selectionModalEl.querySelectorAll('.modal-body .mb-3').forEach(div => div.style.display = '');
                applyGeneralBtn.style.display = 'none';
                loadTreeButton.style.display = 'inline-block';
            }
        });
    }
    // Evento para abrir modal en modo General
    if (selectGeneralBtn) {
        selectGeneralBtn.addEventListener('click', function() {
            generalMode = true;
            // Abrir modal
            const modal = new bootstrap.Modal(selectionModalEl);
            modal.show();
        });
    }
    // Evento para aplicar esquema y categoría al General desde el modal
    if (applyGeneralBtn) {
        applyGeneralBtn.addEventListener('click', function(event) {
            // Validar selección de esquema y categoría
            let valid = true;
            if (!selectedEsquema) {
                esquemaSelect.classList.add('is-invalid'); valid = false;
            }
            if (!selectedCategoria) {
                categoriaSelect.classList.add('is-invalid'); valid = false;
            }
            if (!valid) return;
            // Cerrar modal
            const modalInstance = bootstrap.Modal.getInstance(selectionModalEl);
            if (modalInstance) modalInstance.hide();
            // Mostrar info junto al botón Seleccionar
            const infoSpan = document.getElementById('general-info');
            // Crear badges
            const esquemaBadge = `<span class='badge bg-light text-dark border me-1'>${selectedEsquema.nombre}</span>`;
            const categoriaBadge = `<span class='badge text-dark ms-1' style='background-color:${selectedCategoria.color};'>${selectedCategoria.nombre}</span>`;
            infoSpan.innerHTML = esquemaBadge + categoriaBadge;
            // Reset generalMode
            generalMode = false;
        });
    }
    
    // Inicializar esquema y categoría al cargar la página
    function initDefaultValues() {
        // Por defecto no seleccionamos ningún esquema ni categoría
        selectedEsquema = null;
        selectedCategoria = null;
        
        // Aseguramos que los selectores estén en su valor inicial
        if (esquemaSelect) {
            esquemaSelect.value = "";
        }
        
        if (categoriaSelect) {
            categoriaSelect.value = "";
        }
    }

    // Event listener para el botón de guardar
    saveButton.addEventListener('click', saveSelectedItems);
    
    // Event listener para el botón de cargar árbol desde el modal
    if (loadTreeButton) { // Check if the button exists to prevent errors if it's not on the page
        loadTreeButton.addEventListener('click', function(event) { 
            const selectedLevel = document.querySelector('input[name="level-option"]:checked').value;
            
            // Limpiar validaciones previas
            if (esquemaSelect) esquemaSelect.classList.remove('is-invalid');
            if (categoriaSelect) categoriaSelect.classList.remove('is-invalid');
            
            // Mensaje de error para selección de nivel DCS
            const levelErrorContainer = document.querySelector('.level-error');
            if (levelErrorContainer) {
                levelErrorContainer.style.display = 'none';
            }

            // Assume modal can close unless validation fails for THIS button.
            // The hide.bs.modal listener will handle other close attempts.
            if (parentModalElement) {
                parentModalElement.dataset.preventModalClose = 'false';
            }

            let isValid = true;

            // Verificar que se haya seleccionado un esquema
            if (!selectedEsquema) {
                if (esquemaSelect) esquemaSelect.classList.add('is-invalid');
                isValid = false;
            }
            
            // Verificar que se haya seleccionado una categoría
            if (!selectedCategoria) {
                if (categoriaSelect) categoriaSelect.classList.add('is-invalid');
                isValid = false;
            }
            
            // Verificar que haya al menos un elemento seleccionado en la búsqueda o que se haya seleccionado un nivel
            const hasSearchSelections = Object.keys(searchSelectedItems).length > 0;
            if (!hasSearchSelections) {
                // Si no hay resultados de búsqueda seleccionados, mostrar mensaje de error
                if (levelErrorContainer) {
                    levelErrorContainer.style.display = 'block';
                    isValid = false;
                }
            }
            
            if (!isValid) {
                if (parentModalElement) {
                    // Signal the hide.bs.modal listener to prevent closing if user tries to close via X, ESC, etc.
                    parentModalElement.dataset.preventModalClose = 'true';
                }
                event.preventDefault(); // Prevent the button's default action
                event.stopPropagation(); // Stop the event from bubbling
                return; // Stop processing, modal remains open
            }
            
            // If validation passes:
            // Ensure the flag is false so other close methods aren't blocked by stale state
            if (parentModalElement) {
                parentModalElement.dataset.preventModalClose = 'false';
            }

            // Si todo está validado, continuar
            // Verificar si hay elementos seleccionados del buscador
            try {
                let success = false;
                let resultMessage = '';
                
                // Procesamos primero los datos y preparamos el mensaje
                if (Object.keys(searchSelectedItems).length > 0) {
                    success = loadSelectedItems();
                    resultMessage = success ? 
                        'Árbol cargado correctamente.' : 
                        'No se pudieron cargar los elementos seleccionados.';
                } else {
                    success = loadTreeByLevel(selectedLevel);
                    resultMessage = success ? 
                        'Árbol cargado correctamente.' : 
                        'No se pudo cargar el árbol seleccionado.';
                }
                
                // Primera, eliminamos el focus del elemento actual para evitar problemas de accesibilidad
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                
                // Luego cerramos el modal
                const modalInstance = bootstrap.Modal.getInstance(parentModalElement);
                if (modalInstance) {
                    modalInstance.hide();
                    
                    // Esperamos a que el modal esté completamente cerrado para mostrar la alerta
                    // y evitar conflictos de accesibilidad
                    parentModalElement.addEventListener('hidden.bs.modal', function handleHidden() {
                        // Eliminamos este event listener después de usarlo
                        parentModalElement.removeEventListener('hidden.bs.modal', handleHidden);
                        
                        // Esperamos un poco para asegurarnos que el DOM esté actualizado
                        setTimeout(() => {
                            // Ahora mostramos la notificación
                            if (success) {
                                // Crear y mostrar una nueva alerta de éxito
                                createAndShowAlert('success', resultMessage);
                            } else {
                                // Crear y mostrar una nueva alerta de error
                                createAndShowAlert('danger', resultMessage);
                            }
                            
                            // Establecemos el foco en el botón de añadir
                            const addButton = document.getElementById('add-button');
                            if (addButton && document.body.contains(addButton)) {
                                addButton.focus();
                            }
                        }, 100);
                    });
                }
            } catch (error) {
                console.error('Error al cargar el árbol:', error);
                createAndShowAlert('danger', 'Ocurrió un error inesperado al cargar el árbol.');
            }
        });
    }
    
    // Función unificada para crear y mostrar alertas
    function createAndShowAlert(type, message) {
        // Identifica el tipo de alerta
        const isSuccess = type === 'success';
        const timeout = isSuccess ? 3000 : 5000;
        
        // Buscar el contenedor donde pondremos la alerta
        const alertContainer = document.querySelector('.card-body');
        if (!alertContainer) {
            console.error('No se encontró el contenedor para mostrar la alerta');
            return;
        }
        
        // Remover todas las alertas existentes del mismo tipo para evitar acumulación
        const oldAlerts = alertContainer.querySelectorAll('.alert-' + type);
        oldAlerts.forEach(oldAlert => {
            try {
                oldAlert.remove();
            } catch (e) {
                console.warn('Error al remover alerta antigua:', e);
            }
        });
        
        // Crear una nueva alerta desde cero (no usamos clonación)
        const newAlert = document.createElement('div');
        newAlert.className = `alert alert-${type} alert-dismissible fade show mb-3`;
        newAlert.role = 'alert';
        newAlert.id = `${type}-alert-${Date.now()}`; // ID único
        
        // Agregar contenido según el tipo de alerta
        if (isSuccess) {
            newAlert.textContent = message || 'Árbol cargado correctamente.';
        } else {
            const messageSpan = document.createElement('span');
            messageSpan.className = 'error-message';
            messageSpan.textContent = message || 'Ocurrió un error al cargar el árbol.';
            newAlert.appendChild(messageSpan);
        }
        
        // Agregar el botón de cierre
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close';
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'Close');
        newAlert.appendChild(closeButton);
        
        // Insertar la alerta al inicio del contenedor
        if (alertContainer.firstChild) {
            alertContainer.insertBefore(newAlert, alertContainer.firstChild);
        } else {
            alertContainer.appendChild(newAlert);
        }
        
        // Inicializar manualmente como alerta de Bootstrap
        const bsAlert = new bootstrap.Alert(newAlert);
        
        // Configurar el cierre automático después del tiempo especificado
        setTimeout(() => {
            if (document.body.contains(newAlert)) {
                try {
                    bsAlert.close();
                } catch (error) {
                    console.warn('Error al cerrar la alerta:', error);
                    // Fallback si falla el método close()
                    newAlert.remove();
                }
            }
        }, timeout);
        
        return newAlert;
    }
    
    // Mantenemos estas funciones por compatibilidad pero ahora usan createAndShowAlert
    function showSuccessAlert() {
        return createAndShowAlert('success', 'Árbol cargado correctamente.');
    }
    
    function showErrorAlert(message) {
        return createAndShowAlert('danger', message || 'Ocurrió un error al cargar el árbol.');
    }
    
    // Event listener para el botón de búsqueda
    searchButton.addEventListener('click', performSearch);
    
    // Mostrar resultados mientras el usuario escribe (con pequeño debounce)
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (searchInput.value.trim().length > 1) {
                performSearch();
            } else {
                searchResults.style.display = 'none';
            }
        }, 300);
    });
    
    // También permitir búsqueda al presionar Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Función para encontrar la ruta completa de un elemento
    function findItemPath(itemToFind, tipo) {
        let path = {
            region: null,
            ruta: null,
            circuito: null,
            pdv: null
        };
        
        function findInHierarchy(searchTerm) {
            // Buscar en regiones
            for (const region of jerarquiaData) {
                if ((region.nombre.toLowerCase().includes(searchTerm) || 
                     region.codigo.toLowerCase().includes(searchTerm)) &&
                     tipo === 'region') {
                    path.region = region;
                    return true;
                }
                
                // Buscar en rutas
                for (const ruta of (region.children || [])) {
                    if ((ruta.nombre.toLowerCase().includes(searchTerm) || 
                         ruta.codigo.toLowerCase().includes(searchTerm)) &&
                         tipo === 'ruta') {
                        path.region = region;
                        path.ruta = ruta;
                        return true;
                    }
                    
                    // Buscar en circuitos
                    for (const circuito of (ruta.children || [])) {
                        if ((circuito.nombre.toLowerCase().includes(searchTerm) || 
                             circuito.codigo.toLowerCase().includes(searchTerm)) &&
                             tipo === 'circuito') {
                            path.region = region;
                            path.ruta = ruta;
                            path.circuito = circuito;
                            return true;
                        }
                        
                        // Buscar en PDVs
                        for (const pdv of (circuito.children || [])) {
                            if ((pdv.nombre.toLowerCase().includes(searchTerm) || 
                                 pdv.codigo.toLowerCase().includes(searchTerm)) &&
                                 tipo === 'pdv') {
                                path.region = region;
                                path.ruta = ruta;
                                path.circuito = circuito;
                                path.pdv = pdv;
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        
        findInHierarchy(itemToFind.toLowerCase());
        return path;
    }
    
    // Función para cargar un elemento específico con toda su jerarquía
    function loadItemWithHierarchy(item, tipo) {
        const path = findItemPath(item, tipo);
        if (!path.region) return false;
        
        treeContainer.innerHTML = '';
        
        // Crear el árbol jerárquico
        if (path.region) {
            const regionClone = { ...path.region };
            
            // Si estamos mostrando una ruta específica
            if (path.ruta && tipo === 'ruta') {
                regionClone.children = [path.ruta];
            } 
            // Si estamos mostrando un circuito específico
            else if (path.circuito && tipo === 'circuito') {
                const rutaClone = { ...path.ruta };
                rutaClone.children = [path.circuito];
                regionClone.children = [rutaClone];
            }
            // Si estamos mostrando un PDV específico
            else if (path.pdv && tipo === 'pdv') {
                const rutaClone = { ...path.ruta };
                const circuitoClone = { ...path.circuito };
                circuitoClone.children = [path.pdv];
                rutaClone.children = [circuitoClone];
                regionClone.children = [rutaClone];
            }
            
            const treeItem = createTreeItem(regionClone);
            treeContainer.appendChild(treeItem);
            
            // Expandir automáticamente los nodos para mostrar la jerarquía
            setTimeout(() => {
                const regionToggle = treeItem.querySelector('.tree-toggle');
                if (regionToggle) {
                    regionToggle.click();
                    
                    if (path.ruta) {
                        const rutaItem = document.querySelector(`[data-id="${path.ruta.id}"]`);
                        if (rutaItem) {
                            const rutaToggle = rutaItem.querySelector('.tree-toggle');
                            if (rutaToggle && path.circuito) {
                                rutaToggle.click();
                                
                                // Si hay PDV, expandir el circuito también
                                if (path.pdv) {
                                    const circuitoItem = document.querySelector(`[data-id="${path.circuito.id}"]`);
                                    if (circuitoItem) {
                                        const circuitoToggle = circuitoItem.querySelector('.tree-toggle');
                                        if (circuitoToggle) {
                                            circuitoToggle.click();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }, 100);
            
            return true;
        }
        return false;
    }

    // Función para cargar el árbol según el nivel seleccionado
    function loadTreeByLevel(level) {
        try {
            // Limpiar el contenedor
            treeContainer.innerHTML = '';
            
            switch(level) {
                case 'region':
                    // Mostrar todas las regiones
                    jerarquiaData.forEach(region => {
                        const treeItem = createTreeItem(region);
                        treeContainer.appendChild(treeItem);
                    });
                    break;
                    
                case 'ruta':
                    // Mostrar las rutas con su respectiva región
                    jerarquiaData.forEach(region => {
                        const regionClone = { ...region };
                        const treeItem = createTreeItem(regionClone);
                        treeContainer.appendChild(treeItem);
                        
                        // Expandir automáticamente las regiones para mostrar rutas
                        setTimeout(() => {
                            const regionToggle = treeItem.querySelector('.tree-toggle');
                            if (regionToggle) {
                                regionToggle.click();
                            }
                        }, 100);
                    });
                    break;
                    
                case 'circuito':
                    // Mostrar los circuitos con su jerarquía completa
                    jerarquiaData.forEach(region => {
                        const regionClone = { ...region };
                        const treeItem = createTreeItem(regionClone);
                        treeContainer.appendChild(treeItem);
                        
                        // Expandir automáticamente para mostrar la jerarquía hasta los circuitos
                        setTimeout(() => {
                            const regionToggle = treeItem.querySelector('.tree-toggle');
                            if (regionToggle) {
                                regionToggle.click();
                                
                                // Expandir rutas para mostrar circuitos
                                const rutaToggles = treeItem.querySelectorAll('.tree-item[data-tipo="ruta"] .tree-toggle');
                                rutaToggles.forEach(toggle => {
                                    toggle.click();
                            });
                        }
                    }, 100);
                    });
                    break;
                    
                case 'pdv':
                    // Mostrar los PDVs con su jerarquía completa
                    jerarquiaData.forEach(region => {
                        const regionClone = { ...region };
                        const treeItem = createTreeItem(regionClone);
                        treeContainer.appendChild(treeItem);
                        
                        // Expandir automáticamente para mostrar la jerarquía completa hasta los PDVs
                        setTimeout(() => {
                            const regionToggle = treeItem.querySelector('.tree-toggle');
                            if (regionToggle) {
                                regionToggle.click();
                                
                                // Expandir rutas
                                const rutaToggles = treeItem.querySelectorAll('.tree-item[data-tipo="ruta"] .tree-toggle');
                                rutaToggles.forEach(toggle => {
                                    toggle.click();
                                    
                                    // Buscar toggles de circuitos dentro de la ruta expandida
                                    const rutaItem = toggle.closest('.tree-item');
                                    const circuitoToggles = rutaItem.querySelectorAll('.tree-children .tree-item[data-tipo="circuito"] .tree-toggle');
                                    circuitoToggles.forEach(circuitoToggle => {
                                        circuitoToggle.click();
                                    });
                                });
                            }
                        }, 100);
                    });
                    break;
            }
            
            // Restaurar las selecciones previas después de que se haya cargado el árbol
            setTimeout(() => {
                // Ya no forzamos esquema y categoría por defecto
                // if (!selectedEsquema || !selectedCategoria) {
                //     initDefaultValues();
                // }
                
                // Primero, asegurarse de que todos los checkboxes estén correctamente marcados
                Object.values(selectedItems).forEach(item => {
                    const checkbox = document.getElementById(`check-${item.id}`);
                    if (checkbox) {
                        checkbox.checked = true;
                        
                        // Ya no asignamos esquema y categoría por defecto
                        // if (!item.esquema) item.esquema = selectedEsquema;
                        // if (!item.categoria) item.categoria = selectedCategoria;
                    }
                });
                
                // Luego, aplicar los chips a todos los elementos que tienen checkbox seleccionado
                document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
                    const itemId = checkbox.dataset.id;
                    const treeItem = checkbox.closest('.tree-item');
                    
                    if (selectedItems[itemId]) {
                        // Asegurarse de que el elemento tenga esquema y categoría
                        const esquema = selectedItems[itemId].esquema || selectedEsquema;
                        const categoria = selectedItems[itemId].categoria || selectedCategoria;
                        
                        console.log("Añadiendo chip al cargar árbol para item:", itemId, checkbox.dataset.nombre);
                        addChips(itemId, esquema, categoria);
                        
                        // Asegurar que el elemento tenga la clase has-assigned-values si tiene esquema o categoría
                        if (treeItem && (esquema || categoria)) {
                            treeItem.classList.add('has-assigned-values');
                        }
                    } else if (checkbox.checked) {
                        // Si el checkbox está marcado pero no está en selectedItems, agregarlo
                        if (treeItem) {
                            const item = {
                                id: treeItem.dataset.id,
                                nombre: treeItem.dataset.nombre,
                                codigo: treeItem.dataset.codigo,
                                tipo: treeItem.dataset.tipo,
                                esquema: selectedEsquema,
                                categoria: selectedCategoria
                            };
                            
                            selectedItems[itemId] = item;
                            addChips(itemId, selectedEsquema, selectedCategoria);
                            
                            // Asegurar que el elemento tenga la clase has-assigned-values
                            treeItem.classList.add('has-assigned-values');
                        }
                    }
                });
                
                // Verificar que se hayan aplicado los chips
                console.log("Total de elementos seleccionados:", Object.keys(selectedItems).length);
                
                // Adicionalmente, buscar elementos con clase has-assigned-values y asegurar que muestren sus chips
                document.querySelectorAll('.tree-item.has-assigned-values').forEach(item => {
                    const itemId = item.dataset.id;
                    // Solo procesar si no está ya en selectedItems para evitar duplicaciones
                    if (!selectedItems[itemId]) {
                        const checkbox = document.getElementById(`check-${itemId}`);
                        if (checkbox) {
                            // Marcar el checkbox como seleccionado
                            checkbox.checked = true;
                            
                            // Crear un nuevo item en selectedItems
                            selectedItems[itemId] = {
                                id: itemId,
                                nombre: item.dataset.nombre,
                                codigo: item.dataset.codigo,
                                tipo: item.dataset.tipo,
                                esquema: selectedEsquema,
                                categoria: selectedCategoria
                            };
                            
                            // Aplicar los chips
                            addChips(itemId, selectedEsquema, selectedCategoria);
                        }
                    }
                });
            }, 300);
            return true; // Success
        } catch (error) {
            console.error("Error al cargar el árbol:", error);
            treeContainer.innerHTML = '<div class="alert alert-danger">Error al cargar el árbol según el nivel seleccionado.</div>';
            return false; // Failure
        }
    }
    
    // Función para realizar la búsqueda y mostrar resultados
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const selectedLevel = document.querySelector('input[name="level-option"]:checked').value;
        let results = [];
        
        // Buscar elementos que coincidan con el término de búsqueda
        switch(selectedLevel) {
            case 'region':
                results = jerarquiaData.filter(region => 
                    region.nombre.toLowerCase().includes(searchTerm) || 
                    region.codigo.toLowerCase().includes(searchTerm)
                ).map(region => ({
                    id: region.id,
                    nombre: region.nombre,
                    codigo: region.codigo,
                    tipo: 'region',
                    path: {region}
                }));
                break;
                
            case 'ruta':
                jerarquiaData.forEach(region => {
                    region.children.filter(ruta => 
                        ruta.nombre.toLowerCase().includes(searchTerm) || 
                        ruta.codigo.toLowerCase().includes(searchTerm)
                    ).forEach(ruta => {
                        results.push({
                            id: ruta.id,
                            nombre: ruta.nombre,
                            codigo: ruta.codigo,
                            tipo: 'ruta',
                            path: {region, ruta}
                        });
                    });
                });
                break;
                
            case 'circuito':
                jerarquiaData.forEach(region => {
                    region.children.forEach(ruta => {
                        ruta.children.filter(circuito => 
                            circuito.nombre.toLowerCase().includes(searchTerm) || 
                            circuito.codigo.toLowerCase().includes(searchTerm)
                        ).forEach(circuito => {
                            results.push({
                                id: circuito.id,
                                nombre: circuito.nombre,
                                codigo: circuito.codigo,
                                tipo: 'circuito',
                                path: {region, ruta, circuito}
                            });
                        });
                    });
                });
                break;
                
            case 'pdv':
                jerarquiaData.forEach(region => {
                    region.children.forEach(ruta => {
                        ruta.children.forEach(circuito => {
                            circuito.children && circuito.children.filter(pdv => 
                                pdv.nombre.toLowerCase().includes(searchTerm) || 
                                pdv.codigo.toLowerCase().includes(searchTerm)
                            ).forEach(pdv => {
                                results.push({
                                    id: pdv.id,
                                    nombre: pdv.nombre,
                                    codigo: pdv.codigo,
                                    tipo: 'pdv',
                                    path: {region, ruta, circuito, pdv}
                                });
                            });
                        });
                    });
                });
                break;
        }
        
        // Mostrar resultados
        displaySearchResults(results);
    }
    
    // Función para mostrar los resultados de búsqueda con checkboxes
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="text-center py-2 text-muted">No se encontraron resultados</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        // Crear lista de resultados con checkboxes
        const resultList = document.createElement('ul');
        resultList.className = 'list-group';
        
        results.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item p-2';
            
            // Crear checkbox
            const checkboxContainer = document.createElement('div');
            checkboxContainer.className = 'd-flex align-items-center';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'form-check-input me-2';
            checkbox.id = `search-check-${item.id}`;
            checkbox.dataset.id = item.id;
            checkbox.dataset.tipo = item.tipo;
            checkbox.dataset.codigo = item.codigo;
            checkbox.dataset.nombre = item.nombre;
            checkbox.checked = searchSelectedItems[item.id] !== undefined;
            
            // Manejar selección
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    searchSelectedItems[item.id] = {
                        id: item.id,
                        codigo: item.codigo,
                        nombre: item.nombre,
                        tipo: item.tipo,
                        path: item.path,
                        esquema: selectedEsquema,
                        categoria: selectedCategoria
                    };
                } else {
                    delete searchSelectedItems[item.id];
                }
            });
            
            const label = document.createElement('label');
            label.htmlFor = `search-check-${item.id}`;
            label.className = 'form-check-label';
            
            // Formatear label según tipo
            let labelText = '';
            switch(item.tipo) {
                case 'region':
                    labelText = `<span class="text-primary fw-bold">${item.nombre}</span> <small class="text-muted">(${item.codigo})</small>`;
                    break;
                case 'ruta':
                    labelText = `<span class="text-success">${item.nombre}</span> <small class="text-muted">(${item.codigo})</small>`;
                    break;
                case 'circuito':
                    labelText = `<span class="text-secondary">${item.nombre}</span> <small class="text-muted">(${item.codigo})</small>`;
                    break;
                case 'pdv':
                    labelText = `<span class="text-warning">${item.nombre}</span> <small class="text-muted">(${item.codigo})</small>`;
                    break;
            }
            
            label.innerHTML = labelText;
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            listItem.appendChild(checkboxContainer);
            resultList.appendChild(listItem);
        });
        
        searchResults.appendChild(resultList);
        searchResults.style.display = 'block';
    }
    
    // Función para cargar los elementos seleccionados del buscador
    function loadSelectedItems() {
        try {
            // Limpiar contenedor del árbol
            treeContainer.innerHTML = '';
            
            // Combinar las selecciones actuales con las nuevas selecciones
            // Agregar selecciones nuevas de la búsqueda al objeto selectedItems
            Object.values(searchSelectedItems).forEach(item => {
                selectedItems[item.id] = {
                    id: item.id,
                    codigo: item.codigo,
                    nombre: item.nombre,
                    tipo: item.tipo,
                    path: item.path
                };
            });
            
            // Si no hay elementos seleccionados, mostrar mensaje
            if (Object.keys(selectedItems).length === 0) {
                treeContainer.innerHTML = '<div class="alert alert-info">No hay elementos seleccionados para mostrar.</div>';
                return true; // Consider empty selection as a success case
            }
        
        // Crear una estructura para agrupar por región
        const regionGroups = {};
        
        // Recopilar todas las rutas jerárquicas para los elementos seleccionados
        Object.values(selectedItems).forEach(item => {
            // Si el ítem fue seleccionado en una búsqueda anterior, ya tiene el path
            if (item.path) {
                const path = item.path;
                const regionId = path.region.id;
                
                if (!regionGroups[regionId]) {
                    regionGroups[regionId] = {
                        region: path.region,
                        items: []
                    };
                }
                
                regionGroups[regionId].items.push(item);
            } else {
                // Si no tiene path, buscamos su jerarquía
                let foundPath = null;
                
                // Buscar ítem en la jerarquía
                switch(item.tipo) {
                    case 'region':
                        jerarquiaData.forEach(region => {
                            if (region.id === item.id) {
                                foundPath = { region };
                            }
                        });
                        break;
                        
                    case 'ruta':
                        jerarquiaData.forEach(region => {
                            region.children.forEach(ruta => {
                                if (ruta.id === item.id) {
                                    foundPath = { region, ruta };
                                }
                            });
                        });
                        break;
                        
                    case 'circuito':
                        jerarquiaData.forEach(region => {
                            region.children.forEach(ruta => {
                                ruta.children.forEach(circuito => {
                                    if (circuito.id === item.id) {
                                        foundPath = { region, ruta, circuito };
                                    }
                                });
                            });
                        });
                        break;
                        
                    case 'pdv':
                        jerarquiaData.forEach(region => {
                            region.children.forEach(ruta => {
                                ruta.children.forEach(circuito => {
                                    (circuito.children || []).forEach(pdv => {
                                        if (pdv.id === item.id) {
                                            foundPath = { region, ruta, circuito, pdv };
                                        }
                                    });
                                });
                            });
                        });
                        break;
                }
                
                // Si se encontró el path, agregarlo al grupo correspondiente
                if (foundPath) {
                    item.path = foundPath;
                    const regionId = foundPath.region.id;
                    
                    if (!regionGroups[regionId]) {
                        regionGroups[regionId] = {
                            region: foundPath.region,
                            items: []
                        };
                    }
                    
                    regionGroups[regionId].items.push(item);
                }
            }
        });
        
        // Crear árboles para cada región
        Object.values(regionGroups).forEach(group => {
            const regionClone = JSON.parse(JSON.stringify(group.region));
            regionClone.children = [];
            
            // Agrupar por rutas cuando sea necesario
            const rutaGroups = {};
            
            group.items.forEach(item => {
                if (item.tipo === 'region') {
                    // Si es una región, ya está representada por regionClone
                } else if (item.tipo === 'ruta') {
                    // Si es una ruta, añadirla directamente a la región
                    if (!rutaGroups[item.path.ruta.id]) {
                        rutaGroups[item.path.ruta.id] = JSON.parse(JSON.stringify(item.path.ruta));
                        rutaGroups[item.path.ruta.id].children = [];
                        regionClone.children.push(rutaGroups[item.path.ruta.id]);
                    }
                } else if (item.tipo === 'circuito') {
                    // Si es un circuito, añadirlo a su ruta correspondiente
                    if (!rutaGroups[item.path.ruta.id]) {
                        rutaGroups[item.path.ruta.id] = JSON.parse(JSON.stringify(item.path.ruta));
                        rutaGroups[item.path.ruta.id].children = [];
                        regionClone.children.push(rutaGroups[item.path.ruta.id]);
                    }
                    
                    // Evitar duplicados en los circuitos
                    const circuitoExists = rutaGroups[item.path.ruta.id].children.some(
                        c => c.id === item.path.circuito.id
                    );
                    
                    if (!circuitoExists) {
                        rutaGroups[item.path.ruta.id].children.push(JSON.parse(JSON.stringify(item.path.circuito)));
                    }
                } else if (item.tipo === 'pdv') {
                    // Si es un PDV, asegurar que exista la jerarquía completa
                    if (!rutaGroups[item.path.ruta.id]) {
                        rutaGroups[item.path.ruta.id] = JSON.parse(JSON.stringify(item.path.ruta));
                        rutaGroups[item.path.ruta.id].children = [];
                        regionClone.children.push(rutaGroups[item.path.ruta.id]);
                    }
                    
                    // Verificar si ya existe el circuito
                    let circuito = rutaGroups[item.path.ruta.id].children.find(c => c.id === item.path.circuito.id);
                    
                    if (!circuito) {
                        circuito = JSON.parse(JSON.stringify(item.path.circuito));
                        circuito.children = [];
                        rutaGroups[item.path.ruta.id].children.push(circuito);
                    } else if (!circuito.children) {
                        circuito.children = [];
                    }
                    
                    // Verificar si ya existe el PDV en el circuito
                    const pdvExists = circuito.children.some(p => p.id === item.path.pdv.id);
                    
                    if (!pdvExists) {
                        circuito.children.push(JSON.parse(JSON.stringify(item.path.pdv)));
                    }
                }
            });
            
            // Crear el elemento del árbol
            const treeItem = createTreeItem(regionClone);
            treeContainer.appendChild(treeItem);
            
            // Expandir automáticamente para mostrar los elementos seleccionados
            setTimeout(() => {
                const regionToggle = treeItem.querySelector('.tree-toggle');
                if (regionToggle) {
                    regionToggle.click();
                    
                    // Expandir rutas si hay circuitos o PDVs seleccionados
                    Object.keys(rutaGroups).forEach(rutaId => {
                        const rutaItem = document.querySelector(`[data-id="${rutaId}"]`);
                        if (rutaItem) {
                            const rutaToggle = rutaItem.querySelector('.tree-toggle');
                            if (rutaToggle && rutaGroups[rutaId].children.length > 0) {
                                rutaToggle.click();
                                
                                // Expandir circuitos si hay PDVs seleccionados
                                setTimeout(() => {
                                    rutaGroups[rutaId].children.forEach(circuito => {
                                        if (circuito.children && circuito.children.length > 0) {
                                            const circuitoItem = document.querySelector(`[data-id="${circuito.id}"]`);
                                            if (circuitoItem) {
                                                const circuitoToggle = circuitoItem.querySelector('.tree-toggle');
                                                if (circuitoToggle) {
                                                    circuitoToggle.click();
                                                }
                                            }
                                        }
                                    });
                                }, 100);
                            }
                        }
                    });
                }
            }, 100);
        });
        
        // Sincronizar las selecciones del árbol con los elementos seleccionados después de renderizar
        setTimeout(() => {
            Object.values(selectedItems).forEach(item => {
                const checkbox = document.getElementById(`check-${item.id}`);
                if (checkbox) {
                    checkbox.checked = true;
                    
                    // Añadir chips para mostrar esquema y categoría solo si tiene esquema o categoría
                    if (item.esquema || item.categoria) {
                        addChips(item.id, item.esquema, item.categoria);
                    }
                }
            });
            
            // Verificar que todos los elementos con checkbox marcado muestren sus chips
            document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
                const itemId = checkbox.dataset.id;
                if (selectedItems[itemId] && (selectedItems[itemId].esquema || selectedItems[itemId].categoria)) {
                    addChips(itemId, selectedItems[itemId].esquema, selectedItems[itemId].categoria);
                }
            });
        }, 200);
        
        // Limpiar selecciones de la búsqueda después de cargarlas
        searchSelectedItems = {};
        searchInput.value = '';
        searchResults.style.display = 'none';
        
        // Actualizar el panel de elementos seleccionados
        updateSelectedItemsDisplay();
        
        return true; // Success
    } catch (error) {
        console.error("Error al cargar los elementos seleccionados:", error);
        treeContainer.innerHTML = '<div class="alert alert-danger">Error al cargar los elementos seleccionados.</div>';
        return false; // Failure
    }
}
    
    // Función original de búsqueda (ahora obsoleta, pero mantenida por compatibilidad)
    function searchItems() {
        performSearch();
    }

    // Función para crear un elemento del árbol
    function createTreeItem(item) {
        const treeItem = document.createElement('div');
        treeItem.className = `tree-item`;
        treeItem.dataset.id = item.id;
        treeItem.dataset.tipo = item.tipo;
        treeItem.dataset.codigo = item.codigo;
        treeItem.dataset.nombre = item.nombre;
        
        // Contenedor para el checkbox y el contenido
        const itemContainer = document.createElement('div');
        itemContainer.className = 'd-flex align-items-center flex-wrap';
        
        // Checkbox para selección
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `check-${item.id}`;
        checkbox.className = 'form-check-input';
        checkbox.dataset.id = item.id;
        checkbox.dataset.tipo = item.tipo;
        checkbox.dataset.codigo = item.codigo;
        checkbox.dataset.nombre = item.nombre;
        
        // Añadir event listener para el checkbox
        checkbox.addEventListener('change', function() {
            handleCheckboxChange(this, item);
        });
        
        checkboxContainer.appendChild(checkbox);
        
        // Botón de toggle si tiene hijos
        const hasChildren = item.children && item.children.length > 0;
        const toggleButton = document.createElement('span');
        toggleButton.className = 'tree-toggle';
        toggleButton.innerHTML = hasChildren ? '<i class="bi bi-plus"></i>' : '';
        
        if (hasChildren) {
            toggleButton.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleChildren(this, item.id);
            });
        }
        
        // Contenido del item (nombre y código)
        const content = document.createElement('span');
        content.className = `tree-content level-${item.tipo}`;
        content.innerHTML = `${item.nombre} (${item.codigo})`;
        
        // Añadir elementos al contenedor del item
        itemContainer.appendChild(checkboxContainer);
        if (hasChildren) {
            itemContainer.appendChild(toggleButton);
        }
        itemContainer.appendChild(content);
        
        // Verificar si el elemento ya está seleccionado para mostrar chips
        // O si el elemento debe tener valores asignados (p.ej. cargado desde búsqueda con esquema/categoría)
        if (selectedItems[item.id] || (item.esquema || item.categoria)) {
            checkbox.checked = true; // Asegurar que el checkbox esté marcado
            
            const esquemaToApply = selectedItems[item.id]?.esquema || item.esquema || selectedEsquema;
            const categoriaToApply = selectedItems[item.id]?.categoria || item.categoria || selectedCategoria;
            
            // Añadir chips al elemento
            // Es importante que addChips se llame DESPUÉS de que el elemento esté en el DOM,
            // pero aquí lo preparamos. El addChips real se hará en loadTreeByLevel o loadSelectedItems.
            // Sin embargo, necesitamos marcar `has-assigned-values` si corresponde.
            if (esquemaToApply || categoriaToApply) {
                treeItem.classList.add('has-assigned-values');
                // Actualizar selectedItems si el item viene con esquema/categoria pero no está en selectedItems
                // O si necesita actualizarse con los valores globales si no tiene específicos.
                if (!selectedItems[item.id]) {
                    selectedItems[item.id] = {
                        id: item.id,
                        codigo: item.codigo,
                        nombre: item.nombre,
                        tipo: item.tipo,
                        path: findPathForItem(item), // Asegurar que el path se calcule aquí
                        esquema: esquemaToApply,
                        categoria: categoriaToApply
                    };
                } else {
                    // Si ya existe en selectedItems, asegurarse que tenga el esquema y categoría correctos
                    selectedItems[item.id].esquema = esquemaToApply;
                    selectedItems[item.id].categoria = categoriaToApply;
                }
            }
        }
        
        treeItem.appendChild(itemContainer);
        
        // Contenedor para hijos
        if (hasChildren) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-children';
            childrenContainer.id = `children-${item.id}`;
            
            // Crear elementos hijos
            item.children.forEach(child => {
                const childItem = createTreeItem(child);
                childrenContainer.appendChild(childItem);
            });
            
            treeItem.appendChild(childrenContainer);
        }
        
        return treeItem;
    }

    // Función para mostrar/ocultar hijos
    function toggleChildren(toggleButton, itemId) {
        const childrenContainer = document.getElementById(`children-${itemId}`);
        const icon = toggleButton.querySelector('i');
        
        if (childrenContainer.classList.contains('show')) {
            childrenContainer.classList.remove('show');
            icon.classList.remove('bi-dash');
            icon.classList.add('bi-plus');
        } else {
            childrenContainer.classList.add('show');
            icon.classList.remove('bi-plus');
            icon.classList.add('bi-dash');
        }
        return childrenContainer.classList.contains('show'); // Retornar el estado actual
    }

    // Función para manejar el cambio en un checkbox
    function handleCheckboxChange(checkbox, item) {
        const itemId = checkbox.dataset.id;
        const isChecked = checkbox.checked;
        
        // Actualizar el objeto de elementos seleccionados
        if (isChecked) {
            // Asegurar que tengamos esquema y categoría seleccionados
            if (!selectedEsquema || !selectedCategoria) {
                initDefaultValues();
            }
            
            // Encontrar el path (jerarquía) del elemento
            let path = findPathForItem(item);
            
            // Siempre usar el esquema y categoría seleccionados actualmente
            // Si no hay ninguno seleccionado, usar el primero disponible
            const esquema = selectedEsquema || (esquemas && esquemas.length > 0 ? esquemas[0] : null);
            const categoria = selectedCategoria || (categorias && categorias.length > 0 ? categorias[0] : null);
            
            selectedItems[itemId] = {
                id: itemId,
                codigo: item.codigo,
                nombre: item.nombre,
                tipo: item.tipo,
                path: path,
                esquema: esquema,
                categoria: categoria
            };
            
            // Añadir chips al elemento que se acaba de marcar - SIEMPRE pasando esquema y categoría
            addChips(itemId, esquema, categoria);
            
            console.log(`Elemento seleccionado: ${itemId} - ${item.nombre} - Esquema: ${esquema?.nombre} - Categoría: ${categoria?.nombre}`);
        } else {
            // Eliminar el elemento de la lista de seleccionados
            delete selectedItems[itemId];
            
            // Restaurar el contenido original sin chips
            const treeItem = document.querySelector(`.tree-item[data-id="${itemId}"]`);
            if (treeItem) {
                const contentElement = treeItem.querySelector('.tree-content');
                if (contentElement) {
                    const itemNombre = treeItem.dataset.nombre;
                    const itemCodigo = treeItem.dataset.codigo;
                    const tipo = item.tipo;
                    contentElement.className = `tree-content level-${tipo}`;
                    contentElement.innerHTML = `${itemNombre} (${itemCodigo})`;
                    
                    // Eliminar clases relacionadas con chips
                    contentElement.classList.remove('has-chips');
                    treeItem.classList.remove('has-assigned-values');
                    console.log(`Contenido restaurado para ${itemId}: ${itemNombre} (${itemCodigo})`);
                }
            }
        }
        
        // Si tiene hijos, reflejar la selección en ellos
        if (item.children && item.children.length > 0) {
            updateChildrenCheckboxes(item.children, isChecked, item);
        }
        
        // Actualizar la visualización de elementos seleccionados
        updateSelectedItemsDisplay();
    }
    
    // Función para encontrar el camino jerárquico de un elemento
    function findPathForItem(item) {
        let path = {};
        
        switch(item.tipo) {
            case 'region':
                path = { region: item };
                break;
                
            case 'ruta':
                // Buscar la región padre
                for (const region of jerarquiaData) {
                    for (const ruta of region.children || []) {
                        if (ruta.id === item.id) {
                            path = { region: region, ruta: item };
                            break;
                        }
                    }
                    if (path.region) break;
                }
                break;
                
            case 'circuito':
                // Buscar la región y ruta padre
                for (const region of jerarquiaData) {
                    for (const ruta of region.children || []) {
                        for (const circuito of ruta.children || []) {
                            if (circuito.id === item.id) {
                                path = { region: region, ruta: ruta, circuito: item };
                                break;
                            }
                        }
                        if (path.circuito) break;
                    }
                    if (path.circuito) break;
                }
                break;
                
            case 'pdv':
                // Buscar la región, ruta y circuito padre
                for (const region of jerarquiaData) {
                    for (const ruta of region.children || []) {
                        for (const circuito of ruta.children || []) {
                            for (const pdv of circuito.children || []) {
                                if (pdv.id === item.id) {
                                    path = { region: region, ruta: ruta, circuito: circuito, pdv: item };
                                    break;
                                }
                            }
                            if (path.pdv) break;
                        }
                        if (path.pdv) break;
                    }
                    if (path.pdv) break;
                }
                break;
        }
        
        return path;
    }

    // Función para actualizar los checkboxes de los hijos
    function updateChildrenCheckboxes(children, isChecked, parent) {
        children.forEach(child => {
            const childCheckbox = document.getElementById(`check-${child.id}`);
            if (childCheckbox) {
                childCheckbox.checked = isChecked;
                
                if (isChecked) {
                    // Construir path basado en el padre y el tipo del elemento
                    let path = {};
                    
                    if (parent) {
                        if (parent.tipo === 'region') {
                            path = { region: parent, ruta: child };
                        } else if (parent.tipo === 'ruta') {
                            // Buscar la región padre
                            for (const region of jerarquiaData) {
                                for (const ruta of region.children || []) {
                                    if (ruta.id === parent.id) {
                                        path = { region: region, ruta: parent, circuito: child };
                                        break;
                                    }
                                }
                                if (path.region) break;
                            }
                        }
                    } else {
                        // Si no se proporciona un padre, buscar el path completo
                        path = findPathForItem(child);
                    }
                    
                    selectedItems[child.id] = {
                        id: child.id,
                        codigo: child.codigo,
                        nombre: child.nombre,
                        tipo: child.tipo,
                        path: path,
                        esquema: selectedEsquema,
                        categoria: selectedCategoria
                    };
                    
                    // Siempre añadir chips al elemento hijo con el esquema y categoría actuales
                    addChips(child.id, selectedEsquema, selectedCategoria);
                } else {
                    delete selectedItems[child.id];
                    
                    // Restaurar el contenido original sin chips de manera consistente
                    const treeItem = document.querySelector(`.tree-item[data-id="${child.id}"]`);
                    if (treeItem) {
                        const contentElement = treeItem.querySelector('.tree-content');
                        if (contentElement) {
                            const itemNombre = treeItem.dataset.nombre;
                            const itemCodigo = treeItem.dataset.codigo;
                            const tipo = child.tipo;
                            contentElement.className = `tree-content level-${tipo}`;
                            contentElement.innerHTML = `${itemNombre} (${itemCodigo})`;
                            
                            // Eliminar clases relacionadas con chips
                            contentElement.classList.remove('has-chips');
                            treeItem.classList.remove('has-assigned-values');
                            console.log(`Contenido restaurado para child ${child.id}: ${itemNombre} (${itemCodigo})`);
                        }
                    }
                }
                
                // Aplicar recursivamente a los hijos
                if (child.children && child.children.length > 0) {
                    updateChildrenCheckboxes(child.children, isChecked, child);
                }
            }
        });
    }

    // Función para actualizar la visualización de elementos seleccionados
    function updateSelectedItemsDisplay() {
        const selectedArray = Object.values(selectedItems);
        
        if (selectedArray.length === 0) {
            selectedItemsContainer.innerHTML = '<div class="text-muted text-center">No hay elementos seleccionados</div>';
            return;
        }
        
        // Agrupar elementos por tipo (región, ruta, circuito, pdv)
        const groupedItems = {
            region: selectedArray.filter(item => item.tipo === 'region'),
            ruta: selectedArray.filter(item => item.tipo === 'ruta'),
            circuito: selectedArray.filter(item => item.tipo === 'circuito'),
            pdv: selectedArray.filter(item => item.tipo === 'pdv')
        };
        
        // Crear contenedor principal
        const container = document.createElement('div');
        container.className = 'selected-items-list';
        
        // Añadir título con contador
        const titleRow = document.createElement('div');
        titleRow.className = 'd-flex justify-content-between align-items-center mb-2';
        
        const title = document.createElement('h6');
        title.className = 'fw-bold m-0';
        title.textContent = 'Elementos seleccionados:';
        
        const counter = document.createElement('span');
        counter.className = 'badge bg-primary';
        counter.textContent = selectedArray.length;
        
        titleRow.appendChild(title);
        titleRow.appendChild(counter);
        container.appendChild(titleRow);
        
        // Crear listas agrupadas por tipo
        if (groupedItems.region.length > 0) {
            const regionSection = createTypeSection('Regiones', groupedItems.region, 'bi-globe', 'primary');
            container.appendChild(regionSection);
        }
        
        if (groupedItems.ruta.length > 0) {
            const rutaSection = createTypeSection('Rutas', groupedItems.ruta, 'bi-signpost-split', 'success');
            container.appendChild(rutaSection);
        }
        
        if (groupedItems.circuito.length > 0) {
            const circuitoSection = createTypeSection('Circuitos', groupedItems.circuito, 'bi-diagram-3', 'secondary');
            container.appendChild(circuitoSection);
        }
        
        if (groupedItems.pdv.length > 0) {
            const pdvSection = createTypeSection('PDVs', groupedItems.pdv, 'bi-shop', 'warning');
            container.appendChild(pdvSection);
        }
        
        // Limpiar y añadir el nuevo contenido
        selectedItemsContainer.innerHTML = '';
        selectedItemsContainer.appendChild(container);
    }
    
    // Función auxiliar para crear una sección de elementos por tipo
    function createTypeSection(tipo, items) {
        const section = document.createElement('div');
        section.className = 'mb-3';

        const title = document.createElement('h5');
        title.textContent = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)}s (${items.length})`;
        section.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'list-group selected-items-list';

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            const itemDetails = document.createElement('div');
            
            const itemName = document.createElement('span');
            itemName.textContent = item.nombre;
            itemDetails.appendChild(itemName);

            const itemCode = document.createElement('small');
            itemCode.className = 'text-muted ms-2';
            itemCode.textContent = `(Código: ${item.codigo})`;
            itemDetails.appendChild(itemCode);
            
            if (item.esquema || item.categoria) {
                const infoDiv = document.createElement('div');
                infoDiv.className = 'mt-1 d-flex align-items-center flex-wrap'; // Added d-flex for alignment

                if (item.esquema && item.esquema.nombre) {
                    const esquemaChip = document.createElement('span');
                    esquemaChip.className = 'inline-chip esquema-chip'; 
                    esquemaChip.textContent = item.esquema.nombre;
                    infoDiv.appendChild(esquemaChip);
                }

                if (item.categoria && item.categoria.nombre) {
                    const categoriaChip = document.createElement('span');
                    categoriaChip.className = 'inline-chip categoria-chip';
                    categoriaChip.textContent = item.categoria.nombre;
                    categoriaChip.dataset.categoria = item.categoria.nombre; // For specific category styling
                    // Add a small margin if both chips are present
                    if (item.esquema && item.esquema.nombre) {
                        categoriaChip.style.marginLeft = '4px';
                    }
                    infoDiv.appendChild(categoriaChip);
                }
                itemDetails.appendChild(infoDiv);
            }
            
            listItem.appendChild(itemDetails);

            const removeButton = document.createElement('button');
            removeButton.className = 'btn btn-sm btn-outline-danger';
            removeButton.innerHTML = '<i class="bi bi-x-lg"></i>';
            removeButton.title = 'Quitar de la selección';
            removeButton.addEventListener('click', function() {
                // Quitar elemento de la selección
                delete selectedItems[item.id];
                
                // Desmarcar checkbox si existe
                const checkbox = document.getElementById(`check-${item.id}`);
                if (checkbox) {
                    checkbox.checked = false;
                }
                
                // Actualizar visualización
                updateSelectedItemsDisplay();
            });
            
            listItem.appendChild(removeButton);
            list.appendChild(listItem);
        });
        
        section.appendChild(list);
        return section;
    }

    // Función para guardar los elementos seleccionados
    function saveSelectedItems() {
        const selectedArray = Object.values(selectedItems);
        
        if (selectedArray.length === 0) {
            alert("No hay elementos seleccionados para guardar");
            return;
        }
        
        // Preparar datos para guardar (eliminar información innecesaria como el path)
        const cleanedItems = selectedArray.map(item => ({
            id: item.id,
            codigo: item.codigo,
            nombre: item.nombre,
            tipo: item.tipo,
            esquema: item.esquema ? {
                id: item.esquema.id,
                nombre: item.esquema.nombre,
                forma: item.esquema.forma,
                tipo: item.esquema.tipo,
                valor: item.esquema.valor
            } : null,
            categoria: item.categoria ? {
                id: item.categoria.id,
                nombre: item.categoria.nombre,
                color: item.categoria.color,
                multiplicador: item.categoria.multiplicador
            } : null
        }));
        
        const result = {
            seleccionados: cleanedItems,
            timestamp: new Date().toISOString(),
            stats: {
                total: cleanedItems.length,
                regiones: cleanedItems.filter(i => i.tipo === 'region').length,
                rutas: cleanedItems.filter(i => i.tipo === 'ruta').length,
                circuitos: cleanedItems.filter(i => i.tipo === 'circuito').length,
                pdvs: cleanedItems.filter(i => i.tipo === 'pdv').length
            }
        };
        
        // Crear un objeto Blob para descargar el archivo
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Crear un enlace para descargar y hacer clic en él
        const a = document.createElement('a');
        a.href = url;
        a.download = 'seleccion_jerarquia_' + Date.now() + '.json';
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
        // Mostrar notificación más detallada
        const stats = result.stats;
        alert(`Selección guardada correctamente:\n- ${stats.total} elementos en total\n- ${stats.regiones} regiones\n- ${stats.rutas} rutas\n- ${stats.circuitos} circuitos\n- ${stats.pdvs} PDVs\n\nEsquema: ${selectedEsquema ? selectedEsquema.nombre : 'No seleccionado'}\nCategoría: ${selectedCategoria ? selectedCategoria.nombre : 'No seleccionada'}`);
    }
    
    // Cargar opciones de esquemas y categorías en los selectores
    function loadEsquemas() {
        esquemas.forEach(esquema => {
            const option = document.createElement('option');
            option.value = esquema.id;
            option.textContent = esquema.nombre + ` (${esquema.forma}, ${esquema.tipo})`;
            esquemaSelect.appendChild(option);
        });
    }
    
    function loadCategorias() {
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            option.style.backgroundColor = categoria.color + '20'; // Color con transparencia
            categoriaSelect.appendChild(option);
        });
    }
    
    // Cargar las opciones al iniciar
    loadEsquemas();
    loadCategorias();
    
    // Inicializar valores por defecto después de cargar las opciones
    initDefaultValues();
    
    // Actualizar la información visual del esquema y categoría iniciales
    if (selectedEsquema) {
        const esquemaInfo = document.getElementById('esquema-info');
        if (esquemaInfo) {
            esquemaInfo.style.display = 'block';
            esquemaInfo.querySelector('.esquema-nombre').textContent = selectedEsquema.nombre;
            esquemaInfo.querySelector('.esquema-forma').textContent = selectedEsquema.forma;
            esquemaInfo.querySelector('.esquema-tipo').textContent = selectedEsquema.tipo;
            
            // Formatear el valor según el tipo
            let valorText = '';
            if (selectedEsquema.tipo === '%') {
                valorText = `${selectedEsquema.valor}%`;
            } else if (selectedEsquema.tipo === 'valor') {
                valorText = `$${selectedEsquema.valor.toLocaleString()}`;
            }
            esquemaInfo.querySelector('.esquema-valor').textContent = valorText;
        }
    }
    
    if (selectedCategoria) {
        const categoriaInfo = document.getElementById('categoria-info');
        if (categoriaInfo) {
            categoriaInfo.style.display = 'block';
            const categoriaNombre = categoriaInfo.querySelector('.categoria-nombre');
            categoriaNombre.textContent = selectedCategoria.nombre;
            categoriaNombre.style.color = selectedCategoria.color;
            categoriaInfo.querySelector('.categoria-multiplicador').textContent = `x${selectedCategoria.multiplicador}`;
        }
    }
    
    // Event listeners para los selectores de esquema y categoría (mejorado)
    esquemaSelect.addEventListener('change', function() {
        const esquemaId = this.value;
        selectedEsquema = esquemas.find(e => e.id === esquemaId);
        
        // Actualizar información visible del esquema
        if (selectedEsquema) {
            const esquemaInfo = document.getElementById('esquema-info');
            esquemaInfo.style.display = 'block';
            esquemaInfo.querySelector('.esquema-nombre').textContent = selectedEsquema.nombre;
            esquemaInfo.querySelector('.esquema-forma').textContent = selectedEsquema.forma;
            esquemaInfo.querySelector('.esquema-tipo').textContent = selectedEsquema.tipo;
            
            // Actualizar chips en elementos seleccionados
            updateSelectedItemsChips();
            
            // Formatear el valor según el tipo
            let valorText = '';
            if (selectedEsquema.tipo === '%') {
                valorText = `${selectedEsquema.valor}%`;
            } else if (selectedEsquema.tipo === 'valor') {
                valorText = `$${selectedEsquema.valor.toLocaleString()}`;
            } else if (selectedEsquema.tipo === 'mixto') {
                valorText = `$${selectedEsquema.valor.fijo.toLocaleString()} + ${selectedEsquema.valor.porcentaje}%`;
            }
            esquemaInfo.querySelector('.esquema-valor').textContent = valorText;
            
            // Quitar clase de inválido si estaba presente
            this.classList.remove('is-invalid');
        } else {
            document.getElementById('esquema-info').style.display = 'none';
        }
    });
    
    categoriaSelect.addEventListener('change', function() {
        const categoriaId = this.value;
        selectedCategoria = categorias.find(c => c.id === categoriaId);
        
        // Actualizar información visible de la categoría
        if (selectedCategoria) {
            const categoriaInfo = document.getElementById('categoria-info');
            categoriaInfo.style.display = 'block';
            
            // Aplicar el color de la categoría al título
            const categoriaNombre = categoriaInfo.querySelector('.categoria-nombre');
            categoriaNombre.textContent = selectedCategoria.nombre;
            categoriaNombre.style.color = selectedCategoria.color;
            
            categoriaInfo.querySelector('.categoria-multiplicador').textContent = `x${selectedCategoria.multiplicador}`;
            
            // Actualizar chips en elementos seleccionados
            updateSelectedItemsChips();
            
            // Quitar clase de inválido si estaba presente
            this.classList.remove('is-invalid');
        } else {
            document.getElementById('categoria-info').style.display = 'none';
        }
    });
    
    // Función para añadir chips de esquema y categoría
    function addChips(itemId, esquema, categoria) {
        const treeItem = document.querySelector(`.tree-item[data-id="${itemId}"]`);
        if (!treeItem) {
            console.log("No se encontró el elemento del árbol con ID:", itemId);
            return;
        }
        
        const contentElement = treeItem.querySelector('.tree-content');
        if (!contentElement) {
            console.log("No se encontró el elemento de contenido para el item:", itemId);
            return;
        }
        
        const itemNombre = treeItem.dataset.nombre;
        const itemCodigo = treeItem.dataset.codigo;
        const tipo = treeItem.dataset.tipo;
        
        const checkbox = document.getElementById(`check-${itemId}`);
        // Use checkbox.checked directly later, as its state can change.
        const initialIsChecked = checkbox ? checkbox.checked : false;
        const initialHasAssignedValues = treeItem.classList.contains('has-assigned-values');
        
        if (!initialIsChecked && !initialHasAssignedValues) {
            contentElement.className = `tree-content level-${tipo}`;
            contentElement.innerHTML = `${itemNombre} (${itemCodigo})`;
            contentElement.classList.remove('has-chips');
            treeItem.classList.remove('has-assigned-values');
            return; 
        }
        
        if (initialHasAssignedValues && checkbox && !checkbox.checked) {
            checkbox.checked = true;
        }
        
        // Store original passed values to check if defaults were applied
        const originalPassedEsquema = esquema;
        const originalPassedCategoria = categoria;
        
        if (!esquema && selectedEsquema) {
            esquema = selectedEsquema;
        } else if (!esquema && esquemas && esquemas.length > 0) {
            esquema = esquemas[0];
        }
        
        if (!categoria && selectedCategoria) {
            categoria = selectedCategoria;
        } else if (!categoria && categorias && categorias.length > 0) {
            categoria = categorias[0];
        }
        
        // Use live checkbox state from here
        const currentIsChecked = checkbox ? checkbox.checked : false;

        if ((currentIsChecked || initialHasAssignedValues) && (esquema || categoria)) {
            let contentHTML = `${itemNombre} (${itemCodigo})`;
            if (esquema) {
                contentHTML += ` <span class="inline-chip esquema-chip" data-esquema="${esquema.nombre}">${esquema.nombre}</span>`;
            }
            if (categoria) {
                const categoriaLower = categoria.nombre.toLowerCase();
                const categoriaClass = categoriaLower === 'oro' || categoriaLower === 'diamante' || 
                                       categoriaLower === 'plata' || categoriaLower === 'bronce' ? 
                                       categoriaLower : '';
                contentHTML += ` <span class="inline-chip categoria-chip ${categoriaClass}" data-categoria="${categoria.nombre}">${categoria.nombre}</span>`;
            }
            
            contentElement.innerHTML = contentHTML;
            contentElement.className = `tree-content level-${tipo} has-chips`;
            treeItem.classList.add('has-assigned-values');
            
            // If item is in selectedItems, update its schema/category if defaults were applied by addChips
            if (selectedItems[itemId]) {
                if (esquema !== originalPassedEsquema && selectedItems[itemId].esquema !== esquema) {
                    selectedItems[itemId].esquema = esquema;
                }
                if (categoria !== originalPassedCategoria && selectedItems[itemId].categoria !== categoria) {
                    selectedItems[itemId].categoria = categoria;
                }
            } else if (currentIsChecked || initialHasAssignedValues) {
                // Item is checked or had 'has-assigned-values' but is not in selectedItems.
                // This is a potential desynchronization. handleCheckboxChange should manage adding to selectedItems.
                // Avoid creating an entry here as addChips might not have the full context for the item's intended specific schema/category.
                console.warn(`Item ${itemId} is checked or has 'has-assigned-values' but was not found in selectedItems. Chips applied based on available/default data. Ensure selectedItems is correctly populated.`);
            }
        } else {
            contentElement.innerHTML = `${itemNombre} (${itemCodigo})`;
            contentElement.className = `tree-content level-${tipo}`;
            contentElement.classList.remove('has-chips');
            if (!currentIsChecked) { // Only remove if also not checked
                treeItem.classList.remove('has-assigned-values');
            }
        }
        
        console.log(`Chips aplicados a ${itemId}: "${itemNombre} (${itemCodigo})" + Esquema: ${esquema?.nombre || 'ninguno'} + Categoría: ${categoria?.nombre || 'ninguna'}`);
    }
    
    // Función auxiliar para determinar si un color es claro u oscuro
    function isLightColor(color) {
        // Convertir el color hex a RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calcular el brillo (fórmula común para determinar brillo de un color)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        
        // Si el brillo es mayor a 125, es un color claro
        return brightness > 125;
    }

    // Función para actualizar todos los chips...
    function updateChips() {
        console.log("Actualizando todos los chips...");
        // Actualizar todos los elementos del árbol
        document.querySelectorAll('.tree-item').forEach(item => {
            const contentElement = item.querySelector('.tree-content');
            if (contentElement) {
                const itemId = item.dataset.id;
                const checkbox = document.getElementById(`check-${itemId}`);
                
                if (checkbox && checkbox.checked && selectedItems[itemId]) {
                    // Si el checkbox existe, está marcado y el elemento está en selectedItems
                    // Asegurarnos de usar el esquema y categoría actuales
                    const esquema = selectedItems[itemId].esquema || selectedEsquema;
                    const categoria = selectedItems[itemId].categoria || selectedCategoria;
                    
                    // Añadir los chips con los valores actuales
                    addChips(itemId, esquema, categoria);
                } else {
                    // Si no está seleccionado, restaurar el contenido original sin chips
                    const itemNombre = item.dataset.nombre;
                    const itemCodigo = item.dataset.codigo;
                    const tipo = item.dataset.tipo;
                    contentElement.className = `tree-content level-${tipo}`;
                    contentElement.innerHTML = `${itemNombre} (${itemCodigo})`;
                    contentElement.classList.remove('has-chips');
                    item.classList.remove('has-assigned-values');
                }
            }
        });
    }
    
    // Función para actualizar los chips en elementos ya seleccionados cuando cambia el esquema o categoría
    function updateSelectedItemsChips() {
        console.log("Refrescando chips para elementos seleccionados (que están checkeados) con sus datos almacenados...");
    
        // Ya no actualizamos globalmente selectedItems[itemId].esquema y .categoria aquí.
        // Esos valores se consideran "fijos" una vez asignados a un item en selectedItems,
        // a menos que otra lógica específica los modifique.
        // Esta función ahora solo se encarga de que los chips visuales reflejen
        // el estado actual de selectedItems para los elementos checkeados.
    
        document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
            const itemId = checkbox.dataset.id;
            
            if (selectedItems[itemId]) {
                // Usar el esquema y categoría almacenados para este item.
                // addChips se encargará de la actualización visual.
                addChips(itemId, selectedItems[itemId].esquema, selectedItems[itemId].categoria);
            } else {
                // Este caso (checkbox marcado pero item no en selectedItems) es anómalo si la lógica está sincronizada.
                // Si ocurre, addChips podría aplicar defaults globales o limpiar los chips si no hay esquema/categoria.
                console.warn(`Item ${itemId} con checkbox marcado, pero no encontrado en selectedItems durante updateSelectedItemsChips. Intentando actualizar chips.`);
                addChips(itemId, null, null); // Permitir a addChips manejar esto, posiblemente usando defaults globales.
            }
        });
    
        // Actualizar también el panel de elementos seleccionados, ya que lee de selectedItems.
        updateSelectedItemsDisplay();
    }
});
