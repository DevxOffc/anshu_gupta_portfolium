document.addEventListener("DOMContentLoaded", function () {
  const pdfViewers = document.querySelectorAll(".pdf-viewer");

  pdfViewers.forEach((viewer) => {
    const pdfPath = viewer.getAttribute("data-pdf");
    const canvas = viewer.querySelector(".pdf-canvas");
    const prevBtn = viewer.querySelector(".pdf-prev");
    const nextBtn = viewer.querySelector(".pdf-next");
    const currentPageSpan = viewer.querySelector(".current-page");
    const totalPagesSpan = viewer.querySelector(".total-pages");

    let pdfDoc = null,
      pageNum = 1,
      pageRendering = false,
      pageNumPending = null,
      scale = 1.0;

    function renderPage(num) {
      pageRendering = true;

      pdfDoc.getPage(num).then(function (page) {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(function () {
          pageRendering = false;
          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      currentPageSpan.textContent = num;
    }

    function onPrevPage() {
      if (pageNum <= 1) return;
      pageNum--;
      queueRenderPage(pageNum);
    }

    function onNextPage() {
      if (pageNum >= pdfDoc.numPages) return;
      pageNum++;
      queueRenderPage(pageNum);
    }

    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    pdfjsLib
      .getDocument(pdfPath)
      .promise.then(function (pdfDoc_) {
        pdfDoc = pdfDoc_;
        totalPagesSpan.textContent = pdfDoc.numPages;

        
        pdfDoc.getPage(1).then(function (page) {
          const viewport = page.getViewport({ scale: 1.0 });
          const containerWidth = viewer.clientWidth - 40; // account for padding
          scale = containerWidth / viewport.width;

          
          renderPage(pageNum);
        });

        prevBtn.addEventListener("click", onPrevPage);
        nextBtn.addEventListener("click", onNextPage);
      })
      .catch(function (error) {
        console.error("Error loading PDF: ", error);
        canvas.style.display = "none";
        viewer.innerHTML =
          '<div class="pdf-error">Failed to load PDF. <a href="' +
          pdfPath +
          '" target="_blank">Open in new tab</a></div>';
      });
  });
});
