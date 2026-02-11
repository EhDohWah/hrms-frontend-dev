<template>
    <a-modal
        :open="visible"
        :title="null"
        :footer="null"
        :width="'90vw'"
        :maskClosable="false"
        :destroyOnClose="true"
        :keyboard="true"
        centered
        @cancel="handleClose"
        @afterClose="handleAfterClose"
        :bodyStyle="{ padding: 0, height: '85vh', display: 'flex', flexDirection: 'column' }"
        class="job-offer-report-modal"
    >
        <!-- Custom Modal Header -->
        <template #title>
            <div class="d-flex align-items-center">
                <i class="ti ti-file-description me-2" style="font-size: 20px; color: var(--primary-color);"></i>
                <div>
                    <span class="modal-title-text">Job Offer Report</span>
                    <span v-if="offerInfo.candidateName" class="modal-subtitle">
                        — {{ offerInfo.candidateName }}
                        <span v-if="offerInfo.offerId" class="text-muted">({{ offerInfo.offerId }})</span>
                    </span>
                </div>
            </div>
        </template>

        <!-- Loading State -->
        <div v-if="loading" class="pdf-loading-container">
            <a-spin size="large" tip="Generating PDF...">
                <div class="pdf-loading-content"></div>
            </a-spin>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="pdf-error-container">
            <a-result
                status="error"
                title="Failed to generate PDF"
                :sub-title="error"
            >
                <template #extra>
                    <a-button type="primary" @click="$emit('retry')">
                        <i class="ti ti-refresh me-1"></i> Try Again
                    </a-button>
                    <a-button @click="handleClose">Close</a-button>
                </template>
            </a-result>
        </div>

        <!-- PDF Viewer -->
        <div v-else-if="pdfUrl" class="pdf-viewer-container">
            <iframe
                :src="pdfUrl"
                class="pdf-iframe"
                frameborder="0"
                title="Job Offer PDF"
            ></iframe>
        </div>

        <!-- Empty State (no PDF yet, not loading) -->
        <div v-else class="pdf-empty-container">
            <a-empty description="No PDF available to display." />
        </div>

        <!-- Custom Modal Footer -->
        <div class="pdf-modal-footer">
            <div class="d-flex justify-content-between align-items-center w-100">
                <div class="footer-info text-muted">
                    <i class="ti ti-info-circle me-1"></i>
                    <small>Use the PDF toolbar above to zoom or navigate pages</small>
                </div>
                <div class="d-flex gap-2">
                    <a-button @click="handlePrint" :disabled="!pdfUrl || loading">
                        <i class="ti ti-printer me-1"></i> Print
                    </a-button>
                    <a-button type="primary" @click="handleDownload" :disabled="!pdfUrl || loading">
                        <i class="ti ti-download me-1"></i> Download PDF
                    </a-button>
                    <a-button @click="handleClose">Close</a-button>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
export default {
    name: 'JobOfferReportModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pdfUrl: {
            type: String,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: null
        },
        offerInfo: {
            type: Object,
            default: () => ({ candidateName: '', offerId: '' })
        }
    },
    emits: ['close', 'download', 'retry'],
    setup(props, { emit }) {
        const handleClose = () => {
            emit('close');
        };

        const handleDownload = () => {
            emit('download');
        };

        const handlePrint = () => {
            if (!props.pdfUrl) return;

            // Open the PDF in a new window for printing
            const printWindow = window.open(props.pdfUrl, '_blank');
            if (printWindow) {
                printWindow.addEventListener('load', () => {
                    printWindow.print();
                });
            }
        };

        const handleAfterClose = () => {
            // Clean up Ant Design modal backdrop/overflow
            const backdrops = document.querySelectorAll('.ant-modal-mask, .ant-modal-wrap');
            const openModals = document.querySelectorAll('.ant-modal-wrap:not([style*="display: none"])');
            if (openModals.length === 0) {
                backdrops.forEach(el => {
                    if (el.style.display !== 'none') {
                        el.style.display = 'none';
                    }
                });
            }
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };

        return {
            handleClose,
            handleDownload,
            handlePrint,
            handleAfterClose
        };
    }
};
</script>

<style scoped>
.modal-title-text {
    font-weight: 600;
    font-size: 16px;
}

.modal-subtitle {
    font-weight: 400;
    font-size: 14px;
    color: #595959;
}

/* Loading state - centered spinner */
.pdf-loading-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
}

.pdf-loading-content {
    padding: 50px;
}

/* Error state - centered error message */
.pdf-error-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* PDF viewer - fills available space */
.pdf-viewer-container {
    flex: 1;
    overflow: hidden;
}

.pdf-iframe {
    width: 100%;
    height: 100%;
    border: none;
}

/* Empty state */
.pdf-empty-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Footer - fixed at bottom of modal */
.pdf-modal-footer {
    padding: 12px 24px;
    border-top: 1px solid #f0f0f0;
    background: #fafafa;
    flex-shrink: 0;
}

.footer-info {
    font-size: 12px;
}
</style>

<!-- Global styles for teleported modal -->
<style>
.job-offer-report-modal .ant-modal-header {
    padding: 16px 24px !important;
    margin: 0 !important;
    border-bottom: 1px solid #f0f0f0 !important;
    background: #fff;
}

.job-offer-report-modal .ant-modal-body {
    margin-top: 0 !important;
}

.job-offer-report-modal .ant-modal-close {
    top: 16px;
}
</style>
